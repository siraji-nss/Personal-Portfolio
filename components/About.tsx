'use client';

import { motion } from 'framer-motion';
import type { Stat, AboutConfig } from '@prisma/client';
import BentoAbout from './BentoAbout';

type Props = { about: AboutConfig | null; stats: Stat[] };

const DEFAULT_BIO = `<p>I'm a results-driven Software Engineer and Technical Project Manager with over a decade of experience delivering complex software across fintech, edtech, healthtech, and enterprise sectors. My dual expertise lets me operate at both extremes — writing clean, scalable code and orchestrating multi-stakeholder projects from inception to delivery.</p>`;

const DEFAULT_STATS = [
  { id: '1', value: '10+', label: 'Years Experience', order: 0 },
  { id: '2', value: '30+', label: 'Projects Delivered', order: 1 },
  { id: '3', value: '5+',  label: 'Countries',          order: 2 },
];

function HeadlineGradient({ text }: { text: string }) {
  const words = text.split(' ');
  const pivot = Math.ceil(words.length / 3);
  return (
    <>
      {words.slice(0, pivot).join(' ')}{' '}
      <span className="text-gradient">{words.slice(pivot).join(' ')}</span>
    </>
  );
}

export default function About({ about, stats }: Props) {
  const headline     = about?.headline ?? 'Bridging technology and strategy';
  const bio          = about?.bio?.trim() || DEFAULT_BIO;
  const cvUrl        = about?.cvUrl ?? null;
  const displayStats = stats.length ? stats : DEFAULT_STATS;

  // Extract all bento card overrides saved via admin
  type CardOverride = { id: string; badge?: string; description?: string; bullets?: string; tags?: string };
  const cardOverrides: Record<string, CardOverride> = {};
  if (Array.isArray(about?.cards)) {
    for (const c of about.cards as CardOverride[]) {
      if (c?.id) cardOverrides[c.id] = c;
    }
  }

  return (
    <section id="about" className="py-20 px-6 bg-[#09090b]">
      <div className="max-w-[1440px] mx-auto">

        {/* Section label */}
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">01</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">About</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* LEFT — headline + bio + stats */}
          <div>
            <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              <HeadlineGradient text={headline} />
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 leading-[1.9] text-[15px] wysiwyg"
              dangerouslySetInnerHTML={{ __html: bio }}
            />

            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-8 grid grid-cols-3 gap-4 pt-7 border-t border-white/[0.06]">
              {displayStats.map((stat) => (
                <div key={stat.id}>
                  <p className="text-2xl font-bold text-indigo-400">{stat.value}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Interactive Bento grid */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}>
            <BentoAbout cvUrl={cvUrl} cardOverrides={cardOverrides} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
