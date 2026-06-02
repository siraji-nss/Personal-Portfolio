'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Plus, Check, X, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { createClient, updateClient, deleteClient } from '@/app/actions/clients';
import SaveModal from '@/components/admin/SaveModal';
import ImageUploadField from '@/components/admin/ImageUploadField';

const COMPANIES = ['Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'Technonix'];

type Client = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  company: string;
  order: number;
};

const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
const lblCls = 'block text-[10px] text-zinc-600 uppercase tracking-wider mb-1';

// ─── Individual client card ──────────────────────────────────────────────────

function ClientCard({ client }: { client: Client }) {
  const [open, setOpen]             = useState(false);
  const [name, setName]             = useState(client.name);
  const [logoUrl, setLogoUrl]       = useState(client.logoUrl ?? '');
  const [website, setWebsite]       = useState(client.website ?? '');
  const [company, setCompany]       = useState(client.company);
  const [order, setOrder]           = useState(client.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function reset() {
    setName(client.name); setLogoUrl(client.logoUrl ?? '');
    setWebsite(client.website ?? ''); setCompany(client.company); setOrder(client.order);
    setOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', client.id); fd.append('name', name);
    fd.append('logoUrl', logoUrl); fd.append('website', website);
    fd.append('company', company); fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateClient(fd);
        setModal({ success: true, message: 'Client updated.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete client "${client.name}"?`)) return;
    const fd = new FormData(); fd.append('id', client.id);
    startTransition(() => deleteClient(fd));
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt={client.name} className="w-8 h-8 object-contain rounded shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/[0.08] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{client.name}</p>
            <p className="text-xs text-zinc-600 truncate">{client.company}{client.website ? ` · ${client.website}` : ''}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {client.website && (
              <a href={client.website} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-zinc-600 hover:text-indigo-400 rounded-lg hover:bg-white/[0.04] transition-all">
                <ExternalLink size={13} />
              </a>
            )}
            <button type="button" onClick={() => setOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all">
              <Pencil size={12} /> Edit {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            <button type="button" onClick={handleDelete} disabled={isPending}
              className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all disabled:opacity-40">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {open && (
          <form onSubmit={handleSave} className="border-t border-white/[0.07] px-4 py-4 space-y-3">
            <div><label className={lblCls}>Client Name</label><input value={name} onChange={e => setName(e.target.value)} className={cls} /></div>
            <div>
              <label className={lblCls}>Logo</label>
              <ImageUploadField fieldName="logoUrl_upload" initialUrl={logoUrl} label="" onChangeUrl={setLogoUrl} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lblCls}>Company (filter key)</label>
                <select value={company} onChange={e => setCompany(e.target.value)} className={cls}>
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={lblCls}>Website (optional)</label><input value={website} onChange={e => setWebsite(e.target.value)} className={cls} placeholder="https://…" /></div>
            </div>
            <div className="flex items-center gap-2">
              <label className={lblCls + ' mb-0'}>Order</label>
              <input type="number" value={order} onChange={e => setOrder(+e.target.value)} className={cls + ' w-20'} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={reset}
                className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.08] text-zinc-500 hover:text-white text-xs rounded-lg transition-colors">
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Add form ─────────────────────────────────────────────────────────────────

function AddClientForm({ count }: { count: number }) {
  const [logoUrl, setLogoUrl]       = useState('');
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('logoUrl', logoUrl);
    startTransition(async () => {
      try {
        await createClient(fd);
        form.reset(); setLogoUrl('');
        setModal({ success: true, message: 'Client added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Client</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div><label className={lblCls}>Client Name</label><input name="name" placeholder="Planet Education Network" className={cls} /></div>
          <div>
            <label className={lblCls}>Logo</label>
            <ImageUploadField fieldName="logoUrl_upload" initialUrl={null} label="" onChangeUrl={setLogoUrl} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lblCls}>Company (filter key)</label>
              <select name="company" className={cls}>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={lblCls}>Website (optional)</label><input name="website" placeholder="https://…" className={cls} /></div>
          </div>
          <div className="flex items-center gap-2">
            <label className={lblCls + ' mb-0'}>Order</label>
            <input name="order" type="number" defaultValue={count} className={cls + ' w-20'} />
          </div>
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {isPending ? 'Adding…' : 'Add Client'}
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const sorted = [...initialClients].sort((a, b) =>
    a.company.localeCompare(b.company) || a.order - b.order
  );
  return (
    <>
      <div className="space-y-2 mb-2 max-w-xl">
        {sorted.length === 0 && <p className="text-sm text-zinc-700">No clients yet.</p>}
        {sorted.map(c => <ClientCard key={c.id} client={c} />)}
      </div>
      <div className="max-w-xl"><AddClientForm count={sorted.length} /></div>
    </>
  );
}
