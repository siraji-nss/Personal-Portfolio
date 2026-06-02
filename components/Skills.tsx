'use client';

import { motion } from 'framer-motion';
import type { Skill } from '@prisma/client';

type SkillCategoryData = {
  id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
};

type Props = { skills: Skill[]; categories: SkillCategoryData[] };

// Full Tailwind class strings — must be listed in full for the purger to keep them
const COLOR_STYLES: Record<string, {
  card: string; text: string; dot: string; header: string;
}> = {
  indigo:  { card: 'bg-indigo-500/[0.03] border-indigo-500/[0.12] hover:border-indigo-500/30 hover:bg-indigo-500/[0.07]', text: 'group-hover:text-indigo-300',  dot: 'bg-indigo-500',  header: 'text-indigo-400'  },
  violet:  { card: 'bg-violet-500/[0.03] border-violet-500/[0.12] hover:border-violet-500/30 hover:bg-violet-500/[0.07]', text: 'group-hover:text-violet-300',  dot: 'bg-violet-500',  header: 'text-violet-400'  },
  emerald: { card: 'bg-emerald-500/[0.03] border-emerald-500/[0.12] hover:border-emerald-500/30 hover:bg-emerald-500/[0.07]', text: 'group-hover:text-emerald-300', dot: 'bg-emerald-500', header: 'text-emerald-400' },
  rose:    { card: 'bg-rose-500/[0.03] border-rose-500/[0.12] hover:border-rose-500/30 hover:bg-rose-500/[0.07]',    text: 'group-hover:text-rose-300',    dot: 'bg-rose-500',    header: 'text-rose-400'    },
  blue:    { card: 'bg-blue-500/[0.03] border-blue-500/[0.12] hover:border-blue-500/30 hover:bg-blue-500/[0.07]',    text: 'group-hover:text-blue-300',    dot: 'bg-blue-500',    header: 'text-blue-400'    },
  amber:   { card: 'bg-amber-500/[0.03] border-amber-500/[0.12] hover:border-amber-500/30 hover:bg-amber-500/[0.07]', text: 'group-hover:text-amber-300',   dot: 'bg-amber-500',   header: 'text-amber-400'   },
  cyan:    { card: 'bg-cyan-500/[0.03] border-cyan-500/[0.12] hover:border-cyan-500/30 hover:bg-cyan-500/[0.07]',    text: 'group-hover:text-cyan-300',    dot: 'bg-cyan-500',    header: 'text-cyan-400'    },
  orange:  { card: 'bg-orange-500/[0.03] border-orange-500/[0.12] hover:border-orange-500/30 hover:bg-orange-500/[0.07]', text: 'group-hover:text-orange-300', dot: 'bg-orange-500', header: 'text-orange-400'  },
};

const FALLBACK_STYLE = COLOR_STYLES.indigo;

function SkillCard({ skill, index, style }: { skill: Skill; index: number; style: typeof FALLBACK_STYLE }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.055 }}
      whileHover={{ y: -3 }}
      className={`px-3.5 py-3 border rounded-xl cursor-default transition-all duration-250 group ${style.card}`}
    >
      <p className={`text-sm font-medium text-white ${style.text} transition-colors duration-250`}>
        {skill.name}
      </p>
      <p className="text-[10px] text-zinc-700 mt-0.5 uppercase tracking-wider">{skill.subcategory}</p>
    </motion.div>
  );
}

// ─── Fallback defaults (shown when DB has no data at all) ─────────────────────

const FALLBACK_CATEGORIES: SkillCategoryData[] = [
  { id: '1', name: 'Software Engineering',   slug: 'tech',       color: 'indigo',  order: 0 },
  { id: '2', name: 'Project Management',     slug: 'pm',         color: 'violet',  order: 1 },
  { id: '3', name: 'Business Consultancy',   slug: 'consulting', color: 'emerald', order: 2 },
  { id: '4', name: 'Human Rights Advocacy',  slug: 'advocacy',   color: 'rose',    order: 3 },
];

const FALLBACK_SKILLS: Skill[] = [
  { id: 'f1',  name: 'Next.js',               category: 'tech',       subcategory: 'Frontend',   order: 0 },
  { id: 'f2',  name: 'Node.js',               category: 'tech',       subcategory: 'Backend',    order: 1 },
  { id: 'f3',  name: 'PostgreSQL',            category: 'tech',       subcategory: 'Database',   order: 2 },
  { id: 'f4',  name: 'Flutter',               category: 'tech',       subcategory: 'Mobile',     order: 3 },
  { id: 'f5',  name: 'Figma',                 category: 'tech',       subcategory: 'Design',     order: 4 },
  { id: 'f6',  name: 'Agile / Scrum',         category: 'pm',         subcategory: 'Delivery',   order: 0 },
  { id: 'f7',  name: 'Stakeholder Mgmt',      category: 'pm',         subcategory: 'Leadership', order: 1 },
  { id: 'f8',  name: 'Product Roadmapping',   category: 'pm',         subcategory: 'Strategy',   order: 2 },
  { id: 'f9',  name: 'Risk & Budget Control', category: 'pm',         subcategory: 'Delivery',   order: 3 },
  { id: 'f10', name: 'Business Strategy',     category: 'consulting', subcategory: 'Advisory',   order: 0 },
  { id: 'f11', name: 'Market Analysis',       category: 'consulting', subcategory: 'Research',   order: 1 },
  { id: 'f12', name: 'Digital Transformation',category: 'consulting', subcategory: 'Advisory',   order: 2 },
  { id: 'f13', name: 'Human Rights Law',      category: 'advocacy',   subcategory: 'Legal',      order: 0 },
  { id: 'f14', name: 'Policy Analysis',       category: 'advocacy',   subcategory: 'Research',   order: 1 },
  { id: 'f15', name: 'Community Outreach',    category: 'advocacy',   subcategory: 'Engagement', order: 2 },
];

export default function Skills({ skills, categories }: Props) {
  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;
  const displaySkills     = skills.length     ? skills     : FALLBACK_SKILLS;

  const sorted = [...displayCategories].sort((a, b) => a.order - b.order);

  return (
    <section id="skills" className="py-20 px-6 bg-[#0d0d10]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">03</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Skills</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-10">
          {sorted.map((cat, colIndex) => {
            const style = COLOR_STYLES[cat.color] ?? FALLBACK_STYLE;
            const catSkills = displaySkills
              .filter(s => s.category === cat.slug)
              .sort((a, b) => a.order - b.order);

            if (catSkills.length === 0) return null;

            return (
              <div key={cat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: colIndex * 0.1 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  <h3 className={`text-xs uppercase tracking-[3px] ${style.header} font-semibold`}>
                    {cat.name}
                  </h3>
                </motion.div>
                <div className="grid grid-cols-2 gap-2.5">
                  {catSkills.map((s, i) => (
                    <SkillCard key={s.id} skill={s} index={i} style={style} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
