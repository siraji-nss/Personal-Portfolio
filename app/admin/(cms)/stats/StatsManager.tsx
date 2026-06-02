'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, BarChart2, Loader2 } from 'lucide-react';
import { createStat, updateStat, deleteStat } from '@/app/actions/stats';
import SaveModal from '@/components/admin/SaveModal';

type Stat = { id: string; value: string; label: string; order: number };

const inputCls =
  'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

function StatRow({ stat }: { stat: Stat }) {
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateStat(fd);
        setModal({ success: true, message: 'Stat updated.' });
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
    fd.append('id', stat.id);
    startTransition(async () => {
      try {
        await deleteStat(fd);
      } catch {
        setDeleting(false);
      }
    });
  }

  return (
    <>
      <form
        onSubmit={handleSave}
        className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl"
      >
        <input type="hidden" name="id" value={stat.id} />
        <BarChart2 size={15} className="text-indigo-400 shrink-0" />
        <input name="value" defaultValue={stat.value} placeholder="7+"
          className={`${inputCls} w-24`} />
        <input name="label" defaultValue={stat.label} placeholder="Years Experience"
          className={`${inputCls} flex-1`} />
        <input name="order" type="number" defaultValue={stat.order}
          className={`${inputCls} w-16`} title="Display order" />
        <button type="submit" disabled={isPending}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {isPending ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={handleDelete} disabled={deleting}
          className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all disabled:opacity-40">
          <Trash2 size={14} />
        </button>
      </form>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function AddStatForm({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      try {
        await createStat(fd);
        form.reset();
        setModal({ success: true, message: 'Stat added.' });
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
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl"
      >
        <Plus size={15} className="text-zinc-500 shrink-0" />
        <input name="value" placeholder="7+" required className={`${inputCls} w-24`} />
        <input name="label" placeholder="Years Experience" required className={`${inputCls} flex-1`} />
        <input name="order" type="number" defaultValue={count} className={`${inputCls} w-16`} title="Display order" />
        <button type="submit" disabled={isPending}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {isPending ? 'Adding…' : 'Add'}
        </button>
      </form>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

export default function StatsManager({ initialStats }: { initialStats: Stat[] }) {
  return (
    <>
      <div className="space-y-3 mb-8 max-w-xl">
        {initialStats.map((stat) => (
          <StatRow key={stat.id} stat={stat} />
        ))}
        {initialStats.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No stats yet — add one below.
          </p>
        )}
      </div>
      <div className="max-w-xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Stat</p>
        <AddStatForm count={initialStats.length} />
      </div>
    </>
  );
}
