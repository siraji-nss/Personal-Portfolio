import { prisma } from '@/lib/prisma';
import { createTraining, updateTraining, deleteTraining } from '@/app/actions/training';
import { Plus, Trash2, Award } from 'lucide-react';

const inputCls = 'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

export default async function TrainingAdminPage() {
  const trainings = await prisma.training.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Training &amp; Certifications</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Training records shown in the Resume section under Education.
      </p>

      {/* Existing trainings */}
      <div className="space-y-4 mb-8 max-w-2xl">
        {trainings.map((t) => (
          <div key={t.id} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
            <form action={updateTraining} className="space-y-3">
              <input type="hidden" name="id" value={t.id} />
              <div className="flex items-center gap-3">
                <Award size={15} className="text-indigo-400 shrink-0" />
                <input name="title" defaultValue={t.title} placeholder="Training Title" required
                  className={`${inputCls} flex-1`} />
                <input name="year" defaultValue={t.year} placeholder="2023" required
                  className={`${inputCls} w-24`} />
                <input name="order" type="number" defaultValue={t.order}
                  className={`${inputCls} w-16`} title="Display order" />
              </div>
              <input name="institution" defaultValue={t.institution} placeholder="Institution / Organizer" required
                className={`${inputCls} w-full`} />
              <textarea name="description" defaultValue={t.description ?? ''} placeholder="Optional description…"
                rows={2} className={`${inputCls} w-full`} />
              <div className="flex items-center gap-2">
                <button type="submit"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Save
                </button>
                <form action={deleteTraining} className="inline">
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit"
                    className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all flex items-center gap-1 text-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                </form>
              </div>
            </form>
          </div>
        ))}

        {trainings.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No training records yet — add one below.
          </p>
        )}
      </div>

      {/* Add new */}
      <div className="max-w-2xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Training</p>
        <form action={createTraining} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <Plus size={15} className="text-zinc-500 shrink-0" />
            <input name="title" placeholder="Training Title" required className={`${inputCls} flex-1`} />
            <input name="year" placeholder="2024" required className={`${inputCls} w-24`} />
            <input name="order" type="number" defaultValue={trainings.length}
              className={`${inputCls} w-16`} title="Display order" />
          </div>
          <input name="institution" placeholder="Institution / Organizer" required className={`${inputCls} w-full`} />
          <textarea name="description" placeholder="Optional description…" rows={2} className={`${inputCls} w-full`} />
          <button type="submit"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
            Add Training
          </button>
        </form>
      </div>
    </div>
  );
}
