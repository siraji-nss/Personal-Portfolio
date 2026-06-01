import { prisma } from '@/lib/prisma';
import { createExperience, deleteExperience } from '@/app/actions/experience';
import { Trash2 } from 'lucide-react';

export default async function ExperienceAdminPage() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Experience</h1>
      <p className="text-sm text-zinc-500 mb-8">Work history entries shown in the Resume section.</p>

      <div className="space-y-2 mb-10">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{exp.role}</p>
                {exp.isCurrent && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">Active</span>}
              </div>
              <p className="text-xs text-zinc-600">{exp.company} · {exp.period}</p>
            </div>
            <form action={deleteExperience}>
              <input type="hidden" name="id" value={exp.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1.5">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {experiences.length === 0 && <p className="text-sm text-zinc-700">No experience entries yet.</p>}
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Experience</h2>
        <form action={createExperience} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <Field name="role" label="Role / Title" placeholder="Technical Project Manager" />
            <Field name="company" label="Company" placeholder="Arbree Solutions" />
          </div>
          <Field name="period" label="Period (display text)" placeholder="Sep 2024 – Present" />
          <div className="grid grid-cols-2 gap-4">
            <Field name="startDate" label="Start Date" placeholder="" type="date" />
            <Field name="endDate" label="End Date (leave blank if current)" placeholder="" type="date" />
          </div>
          <Field name="description" label="Description" textarea rows={3} placeholder="Managing multiple software operations..." />
          <Field name="projects" label="Key Projects (one per line)" textarea rows={5} placeholder="Virtual education platform for Planet Education Network" />
          <Field name="note" label="Operational Note (optional)" placeholder="Coordinating Dubai & UK operations" />
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Is Current Role?</label>
            <select name="isCurrent" className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            <input name="order" type="number" placeholder="0" className="w-20 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none" />
            <span className="text-xs text-zinc-600">= order</span>
          </div>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, placeholder, textarea = false, rows = 2, type = 'text' }: {
  name: string; label: string; placeholder: string; textarea?: boolean; rows?: number; type?: string;
}) {
  const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea ? <textarea name={name} placeholder={placeholder} rows={rows} className={cls} /> : <input name={name} placeholder={placeholder} type={type} className={cls} />}
    </div>
  );
}
