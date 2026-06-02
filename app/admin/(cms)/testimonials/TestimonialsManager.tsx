'use client';

import { useState, useTransition, useRef } from 'react';
import {
  Check, X, Trash2, Pencil, Plus, Loader2, Eye, EyeOff,
  Copy, CheckCircle2, ArrowUp, ArrowDown, GripVertical, Save, ExternalLink,
} from 'lucide-react';
import {
  createTestimonial, updateTestimonial, deleteTestimonial,
  toggleTestimonialPublic, batchUpdateTestimonialOrder,
} from '@/app/actions/testimonials';
import SaveModal from '@/components/admin/SaveModal';
import ImageUploadField from '@/components/admin/ImageUploadField';

type Testimonial = {
  id: string;
  name: string;
  designation: string;
  company: string;
  message: string;
  avatarUrl: string | null;
  isPublic: boolean;
  order: number;
  createdAt: string;
};

const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
const lbl = 'block text-[10px] text-zinc-600 uppercase tracking-wider mb-1';

// ─── Individual card ─────────────────────────────────────────────────────────

function TestimonialCard({
  t, isFirst, isLast, onMoveUp, onMoveDown, onDeleted,
}: {
  t: Testimonial; isFirst: boolean; isLast: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onDeleted: () => void;
}) {
  const [open, setOpen]               = useState(false);
  const [name, setName]               = useState(t.name);
  const [designation, setDesignation] = useState(t.designation);
  const [company, setCompany]         = useState(t.company);
  const [message, setMessage]         = useState(t.message);
  const [avatarUrl, setAvatarUrl]     = useState(t.avatarUrl ?? '');
  const [isPublic, setIsPublic]       = useState(t.isPublic);
  const [isPending, startTransition]  = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleToggle() {
    const fd = new FormData();
    fd.append('id', t.id);
    fd.append('isPublic', String(!isPublic));
    startTransition(async () => {
      try {
        await toggleTestimonialPublic(fd);
        setIsPublic(v => !v);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('id', t.id); fd.append('name', name);
    fd.append('designation', designation); fd.append('company', company);
    fd.append('message', message); fd.append('avatarUrl', avatarUrl);
    fd.append('isPublic', String(isPublic)); fd.append('order', String(t.order));
    startTransition(async () => {
      try {
        await updateTestimonial(fd);
        setModal({ success: true, message: 'Testimonial updated.' });
        setOpen(false);
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    const fd = new FormData(); fd.append('id', t.id);
    startTransition(async () => {
      try { await deleteTestimonial(fd); onDeleted(); }
      catch (err) { setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' }); }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className={`rounded-xl border overflow-hidden transition-colors ${isPublic ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : 'border-white/[0.07] bg-white/[0.025]'}`}>
        <div className="flex items-start gap-2 px-3 py-3">
          {/* Reorder arrows */}
          <div className="flex flex-col gap-0.5 shrink-0 pt-0.5">
            <button type="button" onClick={onMoveUp} disabled={isFirst}
              className="p-1 rounded text-zinc-700 hover:text-zinc-300 disabled:opacity-20 transition-colors hover:bg-white/[0.06]">
              <ArrowUp size={12} />
            </button>
            <button type="button" onClick={onMoveDown} disabled={isLast}
              className="p-1 rounded text-zinc-700 hover:text-zinc-300 disabled:opacity-20 transition-colors hover:bg-white/[0.06]">
              <ArrowDown size={12} />
            </button>
          </div>
          <GripVertical size={13} className="text-zinc-800 shrink-0 mt-1" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-white truncate">{t.name}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                {isPublic ? 'Public' : 'Pending'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 mb-1">{t.designation} · {t.company}</p>
            <p className="text-xs text-zinc-500 line-clamp-2 italic">"{t.message}"</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={handleToggle} disabled={isPending} title={isPublic ? 'Hide from site' : 'Publish to site'}
              className={`p-1.5 rounded-lg transition-all ${isPublic ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/[0.08]' : 'text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/[0.06]'}`}>
              {isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button type="button" onClick={() => setOpen(o => !o)}
              className="p-1.5 text-zinc-600 hover:text-zinc-300 rounded-lg hover:bg-white/[0.06] transition-all">
              <Pencil size={13} />
            </button>
            <button type="button" onClick={handleDelete} disabled={isPending}
              className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all disabled:opacity-40">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Edit form */}
        {open && (
          <form onSubmit={handleSave} className="border-t border-white/[0.06] px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Name</label><input value={name} onChange={e => setName(e.target.value)} className={cls} /></div>
              <div><label className={lbl}>Company</label><input value={company} onChange={e => setCompany(e.target.value)} className={cls} /></div>
            </div>
            <div><label className={lbl}>Designation</label><input value={designation} onChange={e => setDesignation(e.target.value)} className={cls} /></div>
            <div><label className={lbl}>Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className={cls} /></div>
            <div>
              <label className={lbl}>Photo</label>
              <ImageUploadField fieldName="_avatar_edit" initialUrl={avatarUrl || null} label="" onChangeUrl={setAvatarUrl} />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
              Make public (show on site)
            </label>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {isPending ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setOpen(false)}
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

function AddForm({ count }: { count: number }) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isPublic, setIsPublic]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('avatarUrl', avatarUrl);
    fd.set('isPublic', String(isPublic));
    fd.set('order', String(count));
    startTransition(async () => {
      try {
        await createTestimonial(fd);
        form.reset(); setAvatarUrl(''); setIsPublic(false); setOpen(false);
        setModal({ success: true, message: 'Testimonial added.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}
      <div className="border-t border-white/[0.06] pt-6">
        <button type="button" onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors mb-4">
          <Plus size={14} /> Add Testimonial {open ? '↑' : '↓'}
        </button>
        {open && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Name *</label><input name="name" required placeholder="Jane Smith" className={cls} /></div>
              <div><label className={lbl}>Company *</label><input name="company" required placeholder="Acme Corp" className={cls} /></div>
            </div>
            <div><label className={lbl}>Designation *</label><input name="designation" required placeholder="CEO" className={cls} /></div>
            <div><label className={lbl}>Message *</label><textarea name="message" required rows={4} className={cls} /></div>
            <div>
              <label className={lbl}>Photo</label>
              <ImageUploadField fieldName="_avatar_add" initialUrl={null} label="" onChangeUrl={setAvatarUrl} />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
              Publish immediately
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {isPending ? 'Adding…' : 'Add Testimonial'}
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="px-4 py-2.5 border border-white/[0.08] text-zinc-500 hover:text-white text-sm rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TestimonialsManager({
  initialTestimonials,
  submitUrl,
}: {
  initialTestimonials: Testimonial[];
  submitUrl: string;
}) {
  const [items, setItems]  = useState(() => [...initialTestimonials].sort((a, b) => a.order - b.order));
  const savedRef           = useRef(items.map(t => t.id).join(','));
  const currentOrder       = items.map(t => t.id).join(',');
  const orderDirty         = currentOrder !== savedRef.current;
  const [saving, startTransition] = useTransition();
  const [modal, setModal]  = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function move(index: number, dir: 'up' | 'down') {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }

  function handleSaveOrder() {
    const fd = new FormData();
    fd.append('ids', JSON.stringify(items.map(t => t.id)));
    startTransition(async () => {
      try {
        await batchUpdateTestimonialOrder(fd);
        savedRef.current = items.map(t => t.id).join(',');
        setModal({ success: true, message: 'Order saved.' });
      } catch (err) {
        setModal({ success: false, message: err instanceof Error ? err.message : 'Error.' });
      }
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(submitUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const pending = items.filter(t => !t.isPublic).length;
  const published = items.filter(t => t.isPublic).length;

  return (
    <>
      {modal && <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />}

      {/* Stats + copy link bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 max-w-3xl">
        <div className="flex items-center gap-4 px-4 py-2.5 bg-white/[0.025] border border-white/[0.07] rounded-xl text-xs flex-1">
          <span className="text-emerald-400 font-semibold">{published} public</span>
          <span className="text-zinc-700">·</span>
          <span className="text-amber-400 font-semibold">{pending} pending review</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">{items.length} total</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.025] border border-white/[0.07] rounded-xl">
          <a href={submitUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <ExternalLink size={11} /> Preview form
          </a>
          <div className="h-3 w-px bg-white/[0.08]" />
          <button onClick={copyLink}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
            {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy form link'}
          </button>
        </div>
      </div>

      {/* Save order bar */}
      {orderDirty && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 mb-4 bg-amber-500/[0.08] border border-amber-500/25 rounded-xl max-w-3xl">
          <p className="text-xs text-amber-300">Order changed — click Save to persist.</p>
          <button onClick={handleSaveOrder} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-xs font-bold rounded-lg transition-colors shrink-0">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? 'Saving…' : 'Save Order'}
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-2 max-w-3xl mb-2">
        {items.length === 0 && (
          <p className="text-sm text-zinc-700 py-4">No testimonials yet. Add one below or share the form link.</p>
        )}
        {items.map((t, i) => (
          <TestimonialCard
            key={t.id} t={t}
            isFirst={i === 0} isLast={i === items.length - 1}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
            onDeleted={() => setItems(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </div>

      <div className="max-w-3xl">
        <AddForm count={items.length} />
      </div>
    </>
  );
}
