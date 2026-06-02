'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Award, Loader2 } from 'lucide-react';
import { createTraining, updateTraining, deleteTraining } from '@/app/actions/training';
import SaveModal from '@/components/admin/SaveModal';

type Training = {
  id: string;
  title: string;
  institution: string;
  year: string;
  description: string | null;
  order: number;
};

const inputCls =
  'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

function TrainingRow({ training }: { training: Training }) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateTraining(fd);
        setModal({ success: true, message: 'Training record updated.' });
      } catch (err) {
        setModal({
          success: false,
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    });
  }

  function handleDelete() {
    setDeleting(true);
    const fd = new FormData();
    fd.append('id', training.id);
    startTransition(async () => {
      try {
        await deleteTraining(fd);
      } catch {
        setDeleting(false);
      }
    });
  }

  return (
    <>
      <div className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
        <form onSubmit={handleSave} className="space-y-3">
          <input type="hidden" name="id" value={training.id} />
          <div className="flex items-center gap-3">
            <Award size={15} className="text-indigo-400 shrink-0" />
            <input name="title" defaultValue={training.title} placeholder="Training Title" required
              className={`${inputCls} flex-1`} />
            <input name="year" defaultValue={training.year} placeholder="2023" required
              className={`${inputCls} w-24`} />
            <input name="order" type="number" defaultValue={training.order}
              className={`${inputCls} w-16`} title="Display order" />
          </div>
          <input name="institution" defaultValue={training.institution} placeholder="Institution / Organizer" required
            className={`${inputCls} w-full`} />
          <textarea name="description" defaultValue={training.description ?? ''} placeholder="Optional description…"
            rows={2} className={`${inputCls} w-full`} />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
              {isPending && <Loader2 size={11} className="animate-spin" />}
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all flex items-center gap-1 text-xs disabled:opacity-40">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </form>
      </div>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function AddTrainingForm({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);
  const formRef = { current: null as HTMLFormElement | null };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      try {
        await createTraining(fd);
        form.reset();
        setModal({ success: true, message: 'Training record added.' });
      } catch (err) {
        setModal({
          success: false,
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Plus size={15} className="text-zinc-500 shrink-0" />
          <input name="title" placeholder="Training Title" required className={`${inputCls} flex-1`} />
          <input name="year" placeholder="2024" required className={`${inputCls} w-24`} />
          <input name="order" type="number" defaultValue={count} className={`${inputCls} w-16`} title="Display order" />
        </div>
        <input name="institution" placeholder="Institution / Organizer" required className={`${inputCls} w-full`} />
        <textarea name="description" placeholder="Optional description…" rows={2} className={`${inputCls} w-full`} />
        <button type="submit" disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {isPending ? 'Adding…' : 'Add Training'}
        </button>
      </form>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

export default function TrainingManager({ initialTrainings }: { initialTrainings: Training[] }) {
  return (
    <>
      <div className="space-y-4 mb-8 max-w-2xl">
        {initialTrainings.map((t) => (
          <TrainingRow key={t.id} training={t} />
        ))}
        {initialTrainings.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No training records yet — add one below.
          </p>
        )}
      </div>
      <div className="max-w-2xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Training</p>
        <AddTrainingForm count={initialTrainings.length} />
      </div>
    </>
  );
}
