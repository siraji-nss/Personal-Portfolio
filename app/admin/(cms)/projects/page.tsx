import { prisma } from '@/lib/prisma';
import { createProject, deleteProject } from '@/app/actions/projects';
import { Trash2 } from 'lucide-react';

const COMPANIES = ['Technonix', 'Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'OproIT'];

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }] });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Projects</h1>
      <p className="text-sm text-zinc-500 mb-8">Portfolio items. The <code className="text-indigo-400">company</code> field drives the filter bar on the site.</p>

      <div className="space-y-2 mb-10">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{p.title}</p>
                {p.featured && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">Featured</span>}
              </div>
              <p className="text-xs text-zinc-600">{p.company} · {p.tags.join(', ')}</p>
            </div>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1.5">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-zinc-700">No projects yet.</p>}
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Project</h2>
        <form action={createProject} className="space-y-4 max-w-2xl">
          <Field name="title" label="Title" placeholder="Virtual Education Platform" />
          <Field name="description" label="Description" textarea placeholder="A comprehensive virtual learning..." />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Company (Filter Key)</label>
              <select name="company" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/40">
                {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Featured?</label>
              <select name="featured" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/40">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <Field name="imageUrl" label="Image URL" placeholder="https://res.cloudinary.com/..." />
          <div className="grid grid-cols-2 gap-4">
            <Field name="liveUrl" label="Live URL" placeholder="https://..." />
            <Field name="githubUrl" label="GitHub URL" placeholder="https://github.com/..." />
          </div>
          <Field name="tags" label="Tags (comma-separated)" placeholder="Next.js, PostgreSQL, SaaS" />
          <Field name="order" label="Order" placeholder="0" type="number" />
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, placeholder, textarea = false, type = 'text' }: { name: string; label: string; placeholder: string; textarea?: boolean; type?: string }) {
  const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea ? <textarea name={name} placeholder={placeholder} rows={3} className={cls} /> : <input name={name} placeholder={placeholder} type={type} className={cls} />}
    </div>
  );
}
