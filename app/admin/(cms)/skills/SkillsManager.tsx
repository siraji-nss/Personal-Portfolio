'use client';

import { useState, useTransition } from 'react';
import {
  Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronRight,
  GripVertical, Loader2,
} from 'lucide-react';
import {
  createSkillCategory, updateSkillCategory, deleteSkillCategory,
  createSkill, updateSkill, deleteSkill,
} from '@/app/actions/skills';
import SaveModal from '@/components/admin/SaveModal';

// ─── Types ──────────────────────────────────────────────────────────────────

type Skill = { id: string; name: string; category: string; subcategory: string; order: number };
type Category = { id: string; name: string; slug: string; color: string; order: number };

// ─── Colour options ─────────────────────────────────────────────────────────

const COLORS = [
  { value: 'indigo',  label: 'Indigo',  dot: 'bg-indigo-500'  },
  { value: 'violet',  label: 'Violet',  dot: 'bg-violet-500'  },
  { value: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
  { value: 'rose',    label: 'Rose',    dot: 'bg-rose-500'    },
  { value: 'blue',    label: 'Blue',    dot: 'bg-blue-500'    },
  { value: 'amber',   label: 'Amber',   dot: 'bg-amber-500'   },
  { value: 'cyan',    label: 'Cyan',    dot: 'bg-cyan-500'    },
  { value: 'orange',  label: 'Orange',  dot: 'bg-orange-500'  },
];

const DOT_MAP: Record<string, string> = {
  indigo:  'bg-indigo-500',
  violet:  'bg-violet-500',
  emerald: 'bg-emerald-500',
  rose:    'bg-rose-500',
  blue:    'bg-blue-500',
  amber:   'bg-amber-500',
  cyan:    'bg-cyan-500',
  orange:  'bg-orange-500',
};

const ACCENT_MAP: Record<string, string> = {
  indigo:  'text-indigo-400  border-indigo-500/25',
  violet:  'text-violet-400  border-violet-500/25',
  emerald: 'text-emerald-400 border-emerald-500/25',
  rose:    'text-rose-400    border-rose-500/25',
  blue:    'text-blue-400    border-blue-500/25',
  amber:   'text-amber-400   border-amber-500/25',
  cyan:    'text-cyan-400    border-cyan-500/25',
  orange:  'text-orange-400  border-orange-500/25',
};

// ─── Shared input style ──────────────────────────────────────────────────────

const inp = 'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

// ─── Individual skill row ────────────────────────────────────────────────────

function SkillRow({ skill, categorySlug }: { skill: Skill; categorySlug: string }) {
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(skill.name);
  const [sub, setSub]           = useState(skill.subcategory);
  const [order, setOrder]       = useState(skill.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSave() {
    const fd = new FormData();
    fd.append('id', skill.id);
    fd.append('name', name);
    fd.append('subcategory', sub);
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateSkill(fd);
        setModal({ success: true, message: 'Skill updated.' });
        setEditing(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    const fd = new FormData();
    fd.append('id', skill.id);
    startTransition(() => deleteSkill(fd));
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] group">
        <GripVertical size={12} className="text-zinc-700 shrink-0" />

        {editing ? (
          <>
            <input value={name} onChange={e => setName(e.target.value)}
              className={`${inp} flex-1 py-1.5 text-xs`} placeholder="Skill name" />
            <input value={sub} onChange={e => setSub(e.target.value)}
              className={`${inp} w-28 py-1.5 text-xs`} placeholder="Subcategory" />
            <input type="number" value={order} onChange={e => setOrder(+e.target.value)}
              className={`${inp} w-16 py-1.5 text-xs`} title="Order" />
            <button onClick={handleSave} disabled={isPending}
              className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors">
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            </button>
            <button onClick={() => { setEditing(false); setName(skill.name); setSub(skill.subcategory); setOrder(skill.order); }}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm text-white truncate">{skill.name}</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider w-28 truncate">{skill.subcategory}</span>
            <span className="text-[10px] text-zinc-700 w-6 text-right">{skill.order}</span>
            <button onClick={() => setEditing(true)}
              className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100">
              <Pencil size={12} />
            </button>
            <button onClick={handleDelete} disabled={isPending}
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>
    </>
  );
}

// ─── Add skill form (per category) ──────────────────────────────────────────

function AddSkillForm({ categorySlug, nextOrder }: { categorySlug: string; nextOrder: number }) {
  const [name, setName] = useState('');
  const [sub, setSub]   = useState('');
  const [order, setOrder] = useState(nextOrder);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', categorySlug);
    fd.append('subcategory', sub);
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await createSkill(fd);
        setName(''); setSub(''); setOrder(order + 1);
        setModal({ success: true, message: 'Skill added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
        <Plus size={11} className="text-zinc-600 shrink-0" />
        <input value={name} onChange={e => setName(e.target.value)} required
          placeholder="Skill name" className={`${inp} flex-1 py-1.5 text-xs`} />
        <input value={sub} onChange={e => setSub(e.target.value)}
          placeholder="Subcategory" className={`${inp} w-28 py-1.5 text-xs`} />
        <input type="number" value={order} onChange={e => setOrder(+e.target.value)}
          className={`${inp} w-16 py-1.5 text-xs`} title="Order" />
        <button type="submit" disabled={isPending}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
          {isPending ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
          Add
        </button>
      </form>
    </>
  );
}

// ─── Category block ──────────────────────────────────────────────────────────

function CategoryBlock({ category, skills }: { category: Category; skills: Skill[] }) {
  const [open, setOpen]         = useState(true);
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(category.name);
  const [color, setColor]       = useState(category.color);
  const [order, setOrder]       = useState(category.order);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  const accent = ACCENT_MAP[category.color] ?? ACCENT_MAP.indigo;
  const dot    = DOT_MAP[category.color] ?? 'bg-indigo-500';

  function handleSaveCat() {
    const fd = new FormData();
    fd.append('id', category.id);
    fd.append('name', name);
    fd.append('color', color);
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await updateSkillCategory(fd);
        setModal({ success: true, message: 'Category updated.' });
        setEditing(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDeleteCat() {
    if (!confirm(`Delete category "${category.name}"? Its skills will become uncategorized.`)) return;
    const fd = new FormData();
    fd.append('id', category.id);
    startTransition(() => deleteSkillCategory(fd));
  }

  const sorted = [...skills].sort((a, b) => a.order - b.order);

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className={`rounded-xl border ${accent} overflow-hidden`}>

        {/* Category header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center gap-2 flex-1 min-w-0">
            {open ? <ChevronDown size={14} className="text-zinc-500 shrink-0" /> : <ChevronRight size={14} className="text-zinc-500 shrink-0" />}
            <div className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
            {editing ? null : (
              <span className={`text-sm font-semibold truncate ${accent.split(' ')[0]}`}>{category.name}</span>
            )}
            {!editing && (
              <span className="text-[10px] text-zinc-700 shrink-0">({skills.length} skill{skills.length !== 1 ? 's' : ''})</span>
            )}
          </button>

          {editing ? (
            <div className="flex items-center gap-2 flex-1">
              <input value={name} onChange={e => setName(e.target.value)}
                className={`${inp} flex-1 py-1.5 text-xs`} placeholder="Category name" />
              <select value={color} onChange={e => setColor(e.target.value)}
                className={`${inp} py-1.5 text-xs`}>
                {COLORS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input type="number" value={order} onChange={e => setOrder(+e.target.value)}
                className={`${inp} w-16 py-1.5 text-xs`} title="Category order" />
              <button onClick={handleSaveCat} disabled={isPending}
                className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors shrink-0">
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              </button>
              <button onClick={() => { setEditing(false); setName(category.name); setColor(category.color); setOrder(category.order); }}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-zinc-700 mr-2">#{category.order}</span>
              <button onClick={() => setEditing(true)}
                className="p-1.5 text-zinc-600 hover:text-zinc-400 rounded-lg hover:bg-white/[0.04] transition-all"
                title="Edit category">
                <Pencil size={12} />
              </button>
              <button onClick={handleDeleteCat} disabled={isPending}
                className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all"
                title="Delete category">
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Skills list */}
        {open && (
          <div className="px-4 pb-4 space-y-1.5 border-t border-white/[0.04]">
            {/* Column headers */}
            <div className="flex items-center gap-2 px-3 pt-2 pb-1">
              <div className="w-3" />
              <span className="flex-1 text-[9px] text-zinc-700 uppercase tracking-wider">Skill name</span>
              <span className="w-28 text-[9px] text-zinc-700 uppercase tracking-wider">Subcategory</span>
              <span className="w-6 text-[9px] text-zinc-700 uppercase tracking-wider text-right">Ord</span>
              <div className="w-14" />
            </div>

            {sorted.length === 0 && (
              <p className="text-[11px] text-zinc-700 italic px-3 py-2">No skills yet — add one below.</p>
            )}

            {sorted.map(skill => (
              <SkillRow key={skill.id} skill={skill} categorySlug={category.slug} />
            ))}

            <AddSkillForm categorySlug={category.slug} nextOrder={sorted.length} />
          </div>
        )}
      </div>
    </>
  );
}

// ─── Add category form ───────────────────────────────────────────────────────

function AddCategoryForm({ nextOrder }: { nextOrder: number }) {
  const [name, setName]   = useState('');
  const [color, setColor] = useState('indigo');
  const [order, setOrder] = useState(nextOrder);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const fd = new FormData();
    fd.append('name', name);
    fd.append('color', color);
    fd.append('order', String(order));
    startTransition(async () => {
      try {
        await createSkillCategory(fd);
        setName(''); setColor('indigo'); setOrder(order + 1);
        setModal({ success: true, message: `Category "${name}" created.` });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="pt-4 border-t border-white/[0.06]">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Category</p>
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
          <Plus size={15} className="text-zinc-500 shrink-0" />
          <input value={name} onChange={e => setName(e.target.value)} required
            placeholder="Category name (e.g. Business Consultancy)"
            className={`${inp} flex-1`} />
          <select value={color} onChange={e => setColor(e.target.value)} className={`${inp} shrink-0`}>
            {COLORS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <div>
            <label className="block text-[9px] text-zinc-700 uppercase tracking-wider mb-0.5">Order</label>
            <input type="number" value={order} onChange={e => setOrder(+e.target.value)}
              className={`${inp} w-16`} />
          </div>
          <button type="submit" disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Create
          </button>
        </form>
        <p className="text-[11px] text-zinc-700 mt-2">
          Slug is auto-generated from the name and used to group skills. It cannot be changed after creation.
        </p>
      </div>
    </>
  );
}

// ─── Uncategorized skills block ──────────────────────────────────────────────

function UncategorizedBlock({ skills, categories }: { skills: Skill[]; categories: Category[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden opacity-70">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
        <div className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
        <span className="text-sm font-semibold text-zinc-500">Uncategorized</span>
        <span className="text-[10px] text-zinc-700">({skills.length} skill{skills.length !== 1 ? 's' : ''})</span>
        <span className="ml-auto text-[10px] text-zinc-700">Create a category with a matching slug to claim these.</span>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {skills.map(s => (
          <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="flex-1 text-sm text-zinc-500">{s.name}</span>
            <span className="text-[10px] text-zinc-700">{s.category}</span>
            <span className="text-[10px] text-zinc-700">{s.subcategory}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root manager ────────────────────────────────────────────────────────────

export default function SkillsManager({
  initialCategories,
  initialSkills,
}: {
  initialCategories: Category[];
  initialSkills: Skill[];
}) {
  const categorySlugs = new Set(initialCategories.map(c => c.slug));
  const uncategorized = initialSkills.filter(s => !categorySlugs.has(s.category));

  const sorted = [...initialCategories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Info bar */}
      <div className="flex items-center gap-3 p-3 bg-white/[0.025] border border-white/[0.06] rounded-xl text-[11px] text-zinc-600">
        <span>Hover a skill row to reveal edit &amp; delete buttons. Use the order number to control sort position.</span>
      </div>

      {sorted.map(cat => (
        <CategoryBlock
          key={cat.id}
          category={cat}
          skills={initialSkills.filter(s => s.category === cat.slug)}
        />
      ))}

      <UncategorizedBlock skills={uncategorized} categories={initialCategories} />

      <AddCategoryForm nextOrder={sorted.length} />
    </div>
  );
}
