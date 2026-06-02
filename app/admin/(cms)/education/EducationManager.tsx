'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Plus, Check, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { createEducation, updateEducation, deleteEducation } from '@/app/actions/education';
import SaveModal from '@/components/admin/SaveModal';

type Education = {
  id: string;
  type: string;
  year: string;
  degree: string;
  institution: string;
  highlight: boolean;
  order: number;
};

const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
const lblCls = 'block text-[10px] text-zinc-600 uppercase tracking-wider mb-1';

// ─── Individual card ─────────────────────────────────────────────────────────

function EducationCard({ edu }: { edu: Education }) {
  const [open, setOpen]             = useState(false);
  const [type, setType]             = useState(edu.type);
  const [year, setYear]             = useState(edu.year);
  const [degree, setDegree]         = useState(edu.degree);
  const [institution, setInstitution] = useState(edu.institution);
  const [highlight, setHighlight]   = useState(edu.highlight);
  const [order, setOrder]           = useState(edu.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function reset() {
    setType(edu.type); setYear(edu.year); setDegree(edu.degree);
    setInstitution(edu.institution); setHighlight(edu.highlight); setOrder(edu.order);
    setOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', edu.id);
    fd.append('type', type); fd.append('year', year); fd.append('degree', degree);
    fd.append('institution', institution); fd.append('highlight', String(highlight));
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateEducation(fd);
        setModal({ success: true, message: 'Education entry updated.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${edu.degree}"?`)) return;
    const fd = new FormData(); fd.append('id', edu.id);
    startTransition(() => deleteEducation(fd));
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate">{edu.degree}</p>
              {edu.highlight && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shrink-0">Highlighted</span>}
            </div>
            <p className="text-xs text-zinc-600 truncate">{edu.institution} · {edu.year}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
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
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lblCls}>Type</label><input value={type} onChange={e => setType(e.target.value)} className={cls} placeholder="University" /></div>
              <div><label className={lblCls}>Year</label><input value={year} onChange={e => setYear(e.target.value)} className={cls} placeholder="2021" /></div>
            </div>
            <div><label className={lblCls}>Degree / Qualification</label><input value={degree} onChange={e => setDegree(e.target.value)} className={cls} /></div>
            <div><label className={lblCls}>Institution</label><input value={institution} onChange={e => setInstitution(e.target.value)} className={cls} /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                Highlighted (university degree)
              </label>
              <div className="flex items-center gap-2">
                <label className={lblCls + ' mb-0'}>Order</label>
                <input type="number" value={order} onChange={e => setOrder(+e.target.value)} className={cls + ' w-20'} />
              </div>
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

function AddEducationForm({ count }: { count: number }) {
  const [highlight, setHighlight] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('highlight', String(highlight));
    startTransition(async () => {
      try {
        await createEducation(fd);
        form.reset(); setHighlight(false);
        setModal({ success: true, message: 'Education entry added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Education</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lblCls}>Type</label><input name="type" placeholder="University" className={cls} /></div>
            <div><label className={lblCls}>Year</label><input name="year" placeholder="2021" className={cls} /></div>
          </div>
          <div><label className={lblCls}>Degree / Qualification</label><input name="degree" placeholder="BSc Computer Science" className={cls} /></div>
          <div><label className={lblCls}>Institution</label><input name="institution" placeholder="North South University" className={cls} /></div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
              Highlighted (university degree)
            </label>
            <div className="flex items-center gap-2">
              <label className={lblCls + ' mb-0'}>Order</label>
              <input name="order" type="number" defaultValue={count} className={cls + ' w-20'} />
            </div>
          </div>
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {isPending ? 'Adding…' : 'Add Entry'}
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function EducationManager({ initialEducation }: { initialEducation: Education[] }) {
  const sorted = [...initialEducation].sort((a, b) => a.order - b.order);
  return (
    <>
      <div className="space-y-2 mb-2 max-w-xl">
        {sorted.length === 0 && <p className="text-sm text-zinc-700">No education entries yet.</p>}
        {sorted.map(edu => <EducationCard key={edu.id} edu={edu} />)}
      </div>
      <div className="max-w-xl"><AddEducationForm count={sorted.length} /></div>
    </>
  );
}
