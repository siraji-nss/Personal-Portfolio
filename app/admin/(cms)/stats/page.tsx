import { prisma } from '@/lib/prisma';
import { createStat, updateStat, deleteStat } from '@/app/actions/stats';
import { Plus, Trash2, BarChart2 } from 'lucide-react';

const inputCls = 'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

export default async function StatsAdminPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">About Stats</h1>
      <p className="text-sm text-zinc-500 mb-8">
        The numbers displayed in the About section (e.g. &quot;7+ Years Experience&quot;).
      </p>

      {/* Existing stats */}
      <div className="space-y-3 mb-8 max-w-xl">
        {stats.map((stat) => (
          <form key={stat.id} action={updateStat}
            className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <input type="hidden" name="id" value={stat.id} />
            <BarChart2 size={15} className="text-indigo-400 shrink-0" />
            <input name="value" defaultValue={stat.value} placeholder="7+"
              className={`${inputCls} w-24`} />
            <input name="label" defaultValue={stat.label} placeholder="Years Experience"
              className={`${inputCls} flex-1`} />
            <input name="order" type="number" defaultValue={stat.order}
              className={`${inputCls} w-16`} title="Display order" />
            <button type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
              Save
            </button>
            <form action={deleteStat} className="inline">
              <input type="hidden" name="id" value={stat.id} />
              <button type="submit"
                className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all">
                <Trash2 size={14} />
              </button>
            </form>
          </form>
        ))}

        {stats.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No stats yet — add one below.
          </p>
        )}
      </div>

      {/* Add new */}
      <div className="max-w-xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Stat</p>
        <form action={createStat} className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
          <Plus size={15} className="text-zinc-500 shrink-0" />
          <input name="value" placeholder="7+" required className={`${inputCls} w-24`} />
          <input name="label" placeholder="Years Experience" required className={`${inputCls} flex-1`} />
          <input name="order" type="number" defaultValue={stats.length} className={`${inputCls} w-16`} title="Display order" />
          <button type="submit"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
