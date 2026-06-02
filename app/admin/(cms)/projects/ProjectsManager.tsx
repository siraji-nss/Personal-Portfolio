'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Plus, Check, X, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { createProject, updateProject, deleteProject } from '@/app/actions/projects';
import SaveModal from '@/components/admin/SaveModal';
import ImageUploadField from '@/components/admin/ImageUploadField';

const COMPANIES = ['Technonix', 'Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'OproIT'];

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  company: string;
  tags: string[];
  featured: boolean;
  order: number;
};

const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
const lblCls = 'block text-[10px] text-zinc-600 uppercase tracking-wider mb-1';

// ─── Edit form for an existing project ───────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen]         = useState(false);
  const [title, setTitle]       = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [imageUrl, setImageUrl] = useState(project.imageUrl ?? '');
  const [liveUrl, setLiveUrl]   = useState(project.liveUrl ?? '');
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? '');
  const [company, setCompany]   = useState(project.company);
  const [tags, setTags]         = useState(project.tags.join(', '));
  const [featured, setFeatured] = useState(project.featured);
  const [order, setOrder]       = useState(project.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function reset() {
    setTitle(project.title); setDescription(project.description);
    setImageUrl(project.imageUrl ?? ''); setLiveUrl(project.liveUrl ?? '');
    setGithubUrl(project.githubUrl ?? ''); setCompany(project.company);
    setTags(project.tags.join(', ')); setFeatured(project.featured); setOrder(project.order);
    setOpen(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', project.id); fd.append('title', title);
    fd.append('description', description); fd.append('imageUrl', imageUrl);
    fd.append('liveUrl', liveUrl); fd.append('githubUrl', githubUrl);
    fd.append('company', company); fd.append('tags', tags);
    fd.append('featured', String(featured)); fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateProject(fd);
        setModal({ success: true, message: 'Project updated.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"?`)) return;
    const fd = new FormData(); fd.append('id', project.id);
    startTransition(() => deleteProject(fd));
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden">
        {/* Collapsed header */}
        <div className="flex items-center gap-3 px-4 py-3">
          {project.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate">{project.title}</p>
              {project.featured && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shrink-0">Featured</span>}
            </div>
            <p className="text-xs text-zinc-600 truncate">{project.company} · {project.tags.join(', ')}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-zinc-600 hover:text-indigo-400 rounded-lg hover:bg-white/[0.04] transition-all">
                <ExternalLink size={13} />
              </a>
            )}
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

        {/* Edit form */}
        {open && (
          <form onSubmit={handleSave} className="border-t border-white/[0.07] px-4 py-4 space-y-3">
            <div><label className={lblCls}>Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={cls} /></div>
            <div><label className={lblCls}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={cls} /></div>
            <div>
              <label className={lblCls}>Project Image</label>
              <ImageUploadField fieldName="imageUrl_upload" initialUrl={imageUrl} label="" hint="Screenshot or banner image." onChangeUrl={setImageUrl} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lblCls}>Company</label>
                <select value={company} onChange={e => setCompany(e.target.value)} className={cls}>
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={lblCls}>Tags (comma-separated)</label><input value={tags} onChange={e => setTags(e.target.value)} className={cls} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lblCls}>Live URL</label><input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className={cls} placeholder="https://…" /></div>
              <div><label className={lblCls}>GitHub URL</label><input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className={cls} placeholder="https://github.com/…" /></div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                Featured
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

function AddProjectForm({ count }: { count: number }) {
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('featured', String(featured));
    fd.set('imageUrl', imageUrl);
    startTransition(async () => {
      try {
        await createProject(fd);
        form.reset(); setFeatured(false); setImageUrl('');
        setModal({ success: true, message: 'Project added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div><label className={lblCls}>Title</label><input name="title" placeholder="Virtual Education Platform" className={cls} /></div>
          <div><label className={lblCls}>Description</label><textarea name="description" rows={3} className={cls} /></div>
          <div>
            <label className={lblCls}>Project Image</label>
            <ImageUploadField fieldName="imageUrl_upload" initialUrl={null} label="" onChangeUrl={setImageUrl} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lblCls}>Company</label>
              <select name="company" className={cls}>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={lblCls}>Tags (comma-separated)</label><input name="tags" placeholder="Next.js, PostgreSQL, SaaS" className={cls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lblCls}>Live URL</label><input name="liveUrl" placeholder="https://…" className={cls} /></div>
            <div><label className={lblCls}>GitHub URL</label><input name="githubUrl" placeholder="https://github.com/…" className={cls} /></div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
              Featured
            </label>
            <div className="flex items-center gap-2">
              <label className={lblCls + ' mb-0'}>Order</label>
              <input name="order" type="number" defaultValue={count} className={cls + ' w-20'} />
            </div>
          </div>
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {isPending ? 'Adding…' : 'Add Project'}
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const sorted = [...initialProjects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });
  return (
    <>
      <div className="space-y-2 mb-2 max-w-2xl">
        {sorted.length === 0 && <p className="text-sm text-zinc-700">No projects yet.</p>}
        {sorted.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
      <div className="max-w-2xl"><AddProjectForm count={sorted.length} /></div>
    </>
  );
}
