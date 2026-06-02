'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Plus, Check, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { createService, updateService, deleteService } from '@/app/actions/services';
import SaveModal from '@/components/admin/SaveModal';
import IconPicker from '@/components/admin/IconPicker';

type Service = {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  order: number;
};

const cls =
  'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

// ─── Individual service card ─────────────────────────────────────────────────

function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen]             = useState(false);
  const [number, setNumber]         = useState(service.number);
  const [icon, setIcon]             = useState(service.icon);
  const [title, setTitle]           = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [tags, setTags]             = useState(service.tags.join(', '));
  const [order, setOrder]           = useState(service.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal]           = useState<{ success: boolean; message: string } | null>(null);

  function reset() {
    setNumber(service.number);
    setIcon(service.icon);
    setTitle(service.title);
    setDescription(service.description);
    setTags(service.tags.join(', '));
    setOrder(service.order);
    setOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', service.id);
    fd.append('number', number);
    fd.append('icon', icon);
    fd.append('title', title);
    fd.append('description', description);
    fd.append('tags', tags);
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateService(fd);
        setModal({ success: true, message: 'Service updated successfully.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Something went wrong.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${service.title}"?`)) return;
    const fd = new FormData();
    fd.append('id', service.id);
    startTransition(() => deleteService(fd));
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}

      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
        {/* Collapsed header — always visible */}
        <div className="flex items-center gap-4 px-4 py-3">
          <span className="text-xs font-mono text-zinc-600 w-5 shrink-0">{service.number}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{service.title}</p>
            <p className="text-xs text-zinc-600 truncate">{service.icon} · {service.tags.join(', ')}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            >
              <Pencil size={12} />
              Edit
              {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all disabled:opacity-40"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Expanded edit form */}
        {open && (
          <form onSubmit={handleSave} className="border-t border-white/[0.07] px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Number</label>
                <input value={number} onChange={e => setNumber(e.target.value)} className={cls} placeholder="01" />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Order</label>
                <input type="number" value={order} onChange={e => setOrder(+e.target.value)} className={cls} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Icon</label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className={cls} placeholder="Business Consultation" />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={cls} placeholder="Strategic guidance for…" />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Tags (comma-separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} className={cls} placeholder="Strategy, Advisory, Market Entry" />
            </div>
            <div className="flex items-center gap-2 pt-1">
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

// ─── Add service form ────────────────────────────────────────────────────────

function AddServiceForm({ nextOrder }: { nextOrder: number }) {
  const [icon, setIcon]           = useState('');
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('icon', icon);
    startTransition(async () => {
      try {
        await createService(fd);
        form.reset();
        setIcon('');
        setModal({ success: true, message: 'Service added successfully.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Something went wrong.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Number</label>
              <input name="number" placeholder="01" className={cls} />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Order</label>
              <input name="order" type="number" defaultValue={nextOrder} className={cls} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Icon</label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Title</label>
            <input name="title" placeholder="Business Consultation" className={cls} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea name="description" rows={3} placeholder="Strategic guidance for…" className={cls} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
            <input name="tags" placeholder="Strategy, Advisory, Market Entry" className={cls} />
          </div>
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {isPending ? 'Adding…' : 'Add Service'}
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Root manager ────────────────────────────────────────────────────────────

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const sorted = [...initialServices].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="space-y-2 mb-2 max-w-2xl">
        {sorted.length === 0 && (
          <p className="text-sm text-zinc-700">No services yet — add one below.</p>
        )}
        {sorted.map(svc => (
          <ServiceCard key={svc.id} service={svc} />
        ))}
      </div>
      <div className="max-w-2xl">
        <AddServiceForm nextOrder={sorted.length} />
      </div>
    </>
  );
}
