'use client';

import { useState, useTransition, useRef } from 'react';
import {
  Pencil, Trash2, Plus, Check, X, Loader2,
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, GripVertical, Save,
} from 'lucide-react';
import {
  createExperience, updateExperience, deleteExperience, batchUpdateExperienceOrder,
} from '@/app/actions/experience';
import SaveModal from '@/components/admin/SaveModal';

// ─── Types ───────────────────────────────────────────────────────────────────

type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  startDate: string;
  endDate: string | null;
  description: string;
  projects: string[];
  note: string | null;
  isCurrent: boolean;
  order: number;
};

const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
const lbl = 'block text-[10px] text-zinc-600 uppercase tracking-wider mb-1';

function toDateInput(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

// ─── Individual card ─────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDeleted,
}: {
  exp: Experience;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleted: () => void;
}) {
  const [open, setOpen]           = useState(false);
  const [role, setRole]           = useState(exp.role);
  const [company, setCompany]     = useState(exp.company);
  const [period, setPeriod]       = useState(exp.period);
  const [startDate, setStartDate] = useState(toDateInput(exp.startDate));
  const [endDate, setEndDate]     = useState(toDateInput(exp.endDate));
  const [description, setDescription] = useState(exp.description);
  const [projects, setProjects]   = useState(exp.projects.join('\n'));
  const [note, setNote]           = useState(exp.note ?? '');
  const [isCurrent, setIsCurrent] = useState(exp.isCurrent);
  const [order, setOrder]         = useState(exp.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function reset() {
    setRole(exp.role); setCompany(exp.company); setPeriod(exp.period);
    setStartDate(toDateInput(exp.startDate)); setEndDate(toDateInput(exp.endDate));
    setDescription(exp.description); setProjects(exp.projects.join('\n'));
    setNote(exp.note ?? ''); setIsCurrent(exp.isCurrent); setOrder(exp.order);
    setOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', exp.id);
    fd.append('role', role);         fd.append('company', company);
    fd.append('period', period);     fd.append('startDate', startDate);
    fd.append('endDate', endDate);   fd.append('description', description);
    fd.append('projects', projects); fd.append('note', note);
    fd.append('isCurrent', String(isCurrent));
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateExperience(fd);
        setModal({ success: true, message: 'Experience updated.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${exp.role} at ${exp.company}"?`)) return;
    const fd = new FormData();
    fd.append('id', exp.id);
    startTransition(async () => {
      try {
        await deleteExperience(fd);
        onDeleted();
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Could not delete.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}

      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
        {/* Collapsed header */}
        <div className="flex items-center gap-2 px-3 py-3">

          {/* Reorder arrows */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              title="Move up"
              className="p-1 rounded text-zinc-700 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-white/[0.06]"
            >
              <ArrowUp size={12} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              title="Move down"
              className="p-1 rounded text-zinc-700 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-white/[0.06]"
            >
              <ArrowDown size={12} />
            </button>
          </div>

          <GripVertical size={13} className="text-zinc-800 shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate">{exp.role}</p>
              {exp.isCurrent && (
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shrink-0">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 truncate">{exp.company} · {exp.period}</p>
          </div>

          {/* Actions */}
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

        {/* Edit form */}
        {open && (
          <form onSubmit={handleSave} className="border-t border-white/[0.07] px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Role / Title</label><input value={role} onChange={e => setRole(e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Company</label><input value={company} onChange={e => setCompany(e.target.value)} className={cls} /></div>
            </div>
            <div><label className={lbl}>Period (display text)</label><input value={period} onChange={e => setPeriod(e.target.value)} className={cls} placeholder="Sep 2024 – Present" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={cls} /></div>
              <div><label className={lbl}>End Date (blank if current)</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={cls} /></div>
            </div>
            <div><label className={lbl}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={cls} /></div>
            <div><label className={lbl}>Key Projects (one per line)</label><textarea value={projects} onChange={e => setProjects(e.target.value)} rows={4} className={cls} /></div>
            <div><label className={lbl}>Operational Note (optional)</label><input value={note} onChange={e => setNote(e.target.value)} className={cls} /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                Current role
              </label>
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

function AddExperienceForm({ onAdded }: { onAdded: (exp: Experience) => void }) {
  const [isCurrent, setIsCurrent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('isCurrent', String(isCurrent));
    startTransition(async () => {
      try {
        await createExperience(fd);
        form.reset();
        setIsCurrent(false);
        setOpen(false);
        setModal({ success: true, message: 'Experience entry added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-6">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors mb-4"
        >
          <Plus size={14} />
          Add Experience Entry
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {open && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Role / Title</label><input name="role" placeholder="Technical Project Manager" className={cls} /></div>
              <div><label className={lbl}>Company</label><input name="company" placeholder="Arbree Solutions" className={cls} /></div>
            </div>
            <div><label className={lbl}>Period (display text)</label><input name="period" placeholder="Sep 2024 – Present" className={cls} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Start Date</label><input name="startDate" type="date" className={cls} /></div>
              <div><label className={lbl}>End Date (blank if current)</label><input name="endDate" type="date" className={cls} /></div>
            </div>
            <div><label className={lbl}>Description</label><textarea name="description" rows={3} className={cls} /></div>
            <div><label className={lbl}>Key Projects (one per line)</label><textarea name="projects" rows={4} className={cls} /></div>
            <div><label className={lbl}>Operational Note (optional)</label><input name="note" className={cls} /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                Current role
              </label>
              <div className="flex items-center gap-2">
                <label className={lbl + ' mb-0'}>Order</label>
                <input name="order" type="number" defaultValue={0} className={cls + ' w-20'} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                {isPending ? 'Adding…' : 'Add Entry'}
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="px-4 py-2.5 border border-white/[0.08] text-zinc-500 hover:text-white text-sm rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Root manager ─────────────────────────────────────────────────────────────

export default function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [items, setItems] = useState(
    () => [...initialExperiences].sort((a, b) => a.order - b.order),
  );
  const savedOrderRef = useRef(initialExperiences.map(e => e.id).join(','));
  const currentOrder  = items.map(e => e.id).join(',');
  const orderDirty    = currentOrder !== savedOrderRef.current;

  const [saving, startTransition]  = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function move(index: number, dir: 'up' | 'down') {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }

  function handleSaveOrder() {
    const fd = new FormData();
    fd.append('ids', JSON.stringify(items.map(e => e.id)));
    startTransition(async () => {
      try {
        await batchUpdateExperienceOrder(fd);
        savedOrderRef.current = items.map(e => e.id).join(',');
        setModal({ success: true, message: 'Order saved successfully.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error saving order.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}

      {/* Save order bar — appears only when order has changed */}
      {orderDirty && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 mb-4 bg-amber-500/[0.08] border border-amber-500/25 rounded-xl max-w-2xl">
          <p className="text-xs text-amber-300">Order changed — click Save to persist.</p>
          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? 'Saving…' : 'Save Order'}
          </button>
        </div>
      )}

      <div className="space-y-2 mb-2 max-w-2xl">
        {items.length === 0 && (
          <p className="text-sm text-zinc-700">No experience entries yet — add one below.</p>
        )}
        {items.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            onMoveUp={() => move(index, 'up')}
            onMoveDown={() => move(index, 'down')}
            onDeleted={() => setItems(prev => prev.filter(e => e.id !== exp.id))}
          />
        ))}
      </div>

      <div className="max-w-2xl">
        <AddExperienceForm onAdded={exp => setItems(prev => [...prev, exp])} />
      </div>
    </>
  );
}
