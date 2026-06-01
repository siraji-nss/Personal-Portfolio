import { prisma } from '@/lib/prisma';
import { createSkill, deleteSkill } from '@/app/actions/skills';
import { Trash2 } from 'lucide-react';

export default async function SkillsAdminPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  const techSkills = skills.filter((s) => s.category === 'tech');
  const pmSkills = skills.filter((s) => s.category === 'pm');

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Skills</h1>
      <p className="text-sm text-zinc-500 mb-8">
        <span className="text-indigo-400">tech</span> = Software Engineering column ·{' '}
        <span className="text-purple-400">pm</span> = Project Management column
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <SkillColumn title="Tech Skills" color="indigo" items={techSkills} />
        <SkillColumn title="PM Skills" color="purple" items={pmSkills} />
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Skill</h2>
        <form action={createSkill} className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <Input name="name" placeholder="e.g. Next.js" label="Name" />
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Category</label>
            <select name="category" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/40">
              <option value="tech">tech (Engineering)</option>
              <option value="pm">pm (Project Management)</option>
            </select>
          </div>
          <Input name="subcategory" placeholder="e.g. Frontend" label="Subcategory" />
          <Input name="order" placeholder="0" label="Order" type="number" />
          <div className="sm:col-span-2">
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SkillColumn({ title, color, items }: { title: string; color: string; items: { id: string; name: string; subcategory: string; order: number }[] }) {
  const ring = color === 'indigo' ? 'text-indigo-400' : 'text-purple-400';
  return (
    <div>
      <h2 className={`text-sm font-semibold mb-3 ${ring}`}>{title}</h2>
      <div className="space-y-1.5">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
            <div>
              <span className="text-sm text-white">{s.name}</span>
              <span className="text-[10px] text-zinc-600 ml-2">{s.subcategory}</span>
            </div>
            <form action={deleteSkill}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1">
                <Trash2 size={13} />
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-zinc-700 py-2">No skills yet.</p>}
      </div>
    </div>
  );
}

function Input({ name, placeholder, label, type = 'text' }: { name: string; placeholder: string; label: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input name={name} type={type} placeholder={placeholder} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all" />
    </div>
  );
}
