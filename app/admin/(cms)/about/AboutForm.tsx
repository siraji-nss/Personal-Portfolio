'use client';

import { useState, useTransition } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import SaveModal from '@/components/admin/SaveModal';
import FileUploadField from '@/components/admin/FileUploadField';
import dynamic from 'next/dynamic';
import { updateAboutConfig } from '@/app/actions/about';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-40 border border-white/[0.08] rounded-xl bg-white/[0.03] flex items-center justify-center">
      <Loader2 size={16} className="animate-spin text-zinc-600" />
    </div>
  ),
});

export type BentoCardData = {
  id:          string;
  badge:       string;
  description: string;
  bullets:     string;  // newline-separated
  tags:        string;  // newline-separated
};

const CARD_META = [
  { id: 'engineering', label: 'Software Engineering & Architecture', color: 'indigo' },
  { id: 'pm',          label: 'Technical Project Management',        color: 'blue'   },
  { id: 'consulting',  label: 'Tech Consulting & Digital Marketing', color: 'emerald'},
  { id: 'social',      label: 'Social Impact & Human Rights',        color: 'rose'   },
];

const ACCENT: Record<string, string> = {
  indigo:  'text-indigo-400  border-indigo-500/30  bg-indigo-500/[0.05]',
  blue:    'text-blue-400    border-blue-500/30    bg-blue-500/[0.05]',
  emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.05]',
  rose:    'text-rose-400    border-rose-500/30    bg-rose-500/[0.05]',
};

interface Props {
  defaultHeadline: string;
  defaultBio:      string;
  defaultCvUrl:    string;
  defaultCards:    Record<string, BentoCardData>;
}

const inputCls  = 'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';
const areaCls   = `${inputCls} resize-none`;

export default function AboutForm({ defaultHeadline, defaultBio, defaultCvUrl, defaultCards = {} }: Props) {
  const [cards, setCards] = useState<Record<string, BentoCardData>>(() => {
    const init: Record<string, BentoCardData> = {};
    for (const m of CARD_META) {
      init[m.id] = defaultCards[m.id] ?? { id: m.id, badge: '', description: '', bullets: '', tags: '' };
    }
    return init;
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(id: string, field: keyof BentoCardData, value: string) {
    setCards(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('cards', JSON.stringify(Object.values(cards)));
    startTransition(async () => {
      try {
        await updateAboutConfig(fd);
        setModal({ success: true, message: 'About section saved successfully.' });
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
    {modal && (
      <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
    )}
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Headline */}
      <div>
        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Headline</label>
        <input name="headline" defaultValue={defaultHeadline} className={inputCls} />
      </div>

      {/* Bio — WYSIWYG */}
      <div>
        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Bio (rich text)</label>
        <TiptapEditor name="bio" defaultValue={defaultBio} />
      </div>

      {/* CV Upload */}
      <FileUploadField
        fieldName="cvUrl"
        label="CV / Resume"
        initialUrl={defaultCvUrl}
        hint='A "Download CV" button appears on the portfolio when this is set.'
      />

      {/* Bento cards */}
      <div>
        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
          Expertise Bento Cards
        </label>
        <p className="text-[11px] text-zinc-600 mb-4 -mt-1">
          Each card has a badge label, description, bullet points (one per line), and tags (one per line).
          Leave blank to use the default built-in content.
        </p>

        <div className="space-y-2">
          {CARD_META.map(meta => {
            const card    = cards[meta.id];
            const accent  = ACCENT[meta.color];
            const isOpen  = expanded === meta.id;

            return (
              <div key={meta.id} className={`border rounded-xl overflow-hidden ${accent}`}>
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : meta.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${accent.split(' ')[0]}`}>{meta.label}</span>
                    {card.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${accent}`}>{card.badge}</span>
                    )}
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
                    {/* Badge */}
                    <div>
                      <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Badge Label</label>
                      <input
                        value={card.badge}
                        onChange={e => update(meta.id, 'badge', e.target.value)}
                        placeholder="e.g. 7+ Years"
                        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Description paragraph</label>
                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={e => update(meta.id, 'description', e.target.value)}
                        placeholder="Short paragraph shown at the top of the expanded card…"
                        className={areaCls + ' text-xs'}
                      />
                    </div>

                    {/* Bullets */}
                    <div>
                      <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                        Bullet points <span className="normal-case tracking-normal text-zinc-700">(one per line)</span>
                      </label>
                      <textarea
                        rows={5}
                        value={card.bullets}
                        onChange={e => update(meta.id, 'bullets', e.target.value)}
                        placeholder={"Full-stack web & mobile development\nRESTful API design & microservices\n..."}
                        className={areaCls + ' text-xs font-mono'}
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                        Tags / badges <span className="normal-case tracking-normal text-zinc-700">(one per line)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={card.tags}
                        onChange={e => update(meta.id, 'tags', e.target.value)}
                        placeholder={"Next.js\nNode.js\nPostgreSQL\n..."}
                        className={areaCls + ' text-xs font-mono'}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors">
        {isPending && <Loader2 size={14} className="animate-spin" />}
        {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
    </>
  );
}
