import { prisma } from '@/lib/prisma';
import { createEducation, deleteEducation } from '@/app/actions/education';
import { Trash2 } from 'lucide-react';

export default async function EducationAdminPage() {
  const education = await prisma.education.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Education</h1>
      <p className="text-sm text-zinc-500 mb-8">Academic entries shown in the Resume section left column.</p>

      <div className="space-y-2 mb-10">
        {education.map((edu) => (
          <div key={edu.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">{edu.degree}</p>
              <p className="text-xs text-zinc-600">{edu.institution} · {edu.year}</p>
            </div>
            <form action={deleteEducation}>
              <input type="hidden" name="id" value={edu.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1.5">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {education.length === 0 && <p className="text-sm text-zinc-700">No education entries yet.</p>}
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Education</h2>
        <form action={createEducation} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <Field name="type" label="Type" placeholder="University" />
            <Field name="year" label="Year" placeholder="2021" />
          </div>
          <Field name="degree" label="Degree" placeholder="BSc Computer Science & Engineering" />
          <Field name="institution" label="Institution" placeholder="North South University" />
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Highlighted?</label>
              <select name="highlight" className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none">
                <option value="false">No</option>
                <option value="true">Yes (University degree)</option>
              </select>
            </div>
            <Field name="order" label="Order" placeholder="0" type="number" />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, placeholder, type = 'text' }: { name: string; label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input name={name} placeholder={placeholder} type={type} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all" />
    </div>
  );
}
