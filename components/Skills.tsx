'use client';

import { motion } from 'framer-motion';
import type { Skill } from '@prisma/client';

type Props = { skills: Skill[] };

const DEFAULT_TECH: Skill[] = [
  { id: '1', name: 'Next.js',       category: 'tech', subcategory: 'Frontend',  order: 0 },
  { id: '2', name: 'Node.js',       category: 'tech', subcategory: 'Backend',   order: 1 },
  { id: '3', name: 'PostgreSQL',    category: 'tech', subcategory: 'Database',  order: 2 },
  { id: '4', name: 'MongoDB',       category: 'tech', subcategory: 'Database',  order: 3 },
  { id: '5', name: 'Laravel',       category: 'tech', subcategory: 'Backend',   order: 4 },
  { id: '6', name: 'Flutter',       category: 'tech', subcategory: 'Mobile',    order: 5 },
  { id: '7', name: 'Kotlin',        category: 'tech', subcategory: 'Mobile',    order: 6 },
  { id: '8', name: 'WordPress',     category: 'tech', subcategory: 'CMS',       order: 7 },
  { id: '9', name: 'Figma',         category: 'tech', subcategory: 'Design',    order: 8 },
  { id: '10', name: 'DigitalOcean', category: 'tech', subcategory: 'Infra',     order: 9 },
];

const DEFAULT_PM: Skill[] = [
  { id: '11', name: 'Agile / Scrum',            category: 'pm', subcategory: 'Delivery',   order: 0 },
  { id: '12', name: 'Stakeholder Management',   category: 'pm', subcategory: 'Leadership', order: 1 },
  { id: '13', name: 'Product Roadmapping',      category: 'pm', subcategory: 'Strategy',   order: 2 },
  { id: '14', name: 'Risk & Budget Control',    category: 'pm', subcategory: 'Delivery',   order: 3 },
  { id: '15', name: 'Cross-functional Teams',   category: 'pm', subcategory: 'Leadership', order: 4 },
  { id: '16', name: 'Market Entry Strategy',    category: 'pm', subcategory: 'Strategy',   order: 5 },
  { id: '17', name: 'Client Communication',     category: 'pm', subcategory: 'Leadership', order: 6 },
  { id: '18', name: 'Process Optimisation',     category: 'pm', subcategory: 'Delivery',   order: 7 },
];

const DEFAULT_CONSULTING: Skill[] = [
  { id: '19', name: 'Business Strategy',        category: 'consulting', subcategory: 'Advisory',   order: 0 },
  { id: '20', name: 'Market Analysis',          category: 'consulting', subcategory: 'Research',   order: 1 },
  { id: '21', name: 'Digital Transformation',  category: 'consulting', subcategory: 'Advisory',   order: 2 },
  { id: '22', name: 'Process Reengineering',   category: 'consulting', subcategory: 'Operations', order: 3 },
  { id: '23', name: 'Financial Modelling',      category: 'consulting', subcategory: 'Finance',    order: 4 },
  { id: '24', name: 'Growth Strategy',          category: 'consulting', subcategory: 'Advisory',   order: 5 },
];

const DEFAULT_ADVOCACY: Skill[] = [
  { id: '25', name: 'Human Rights Law',         category: 'advocacy', subcategory: 'Legal',       order: 0 },
  { id: '26', name: 'Policy Analysis',          category: 'advocacy', subcategory: 'Research',    order: 1 },
  { id: '27', name: 'Community Outreach',       category: 'advocacy', subcategory: 'Engagement',  order: 2 },
  { id: '28', name: 'Legal Documentation',      category: 'advocacy', subcategory: 'Legal',       order: 3 },
  { id: '29', name: 'Public Speaking',          category: 'advocacy', subcategory: 'Leadership',  order: 4 },
  { id: '30', name: 'NGO Management',           category: 'advocacy', subcategory: 'Operations',  order: 5 },
];

type Variant = 'tech' | 'pm' | 'consulting' | 'advocacy';

function SkillCard({ skill, index, variant }: { skill: Skill; index: number; variant: Variant }) {
  const styles: Record<Variant, { card: string; text: string }> = {
    tech: {
      card: 'bg-indigo-500/[0.03] border-indigo-500/[0.12] hover:border-indigo-500/30 hover:bg-indigo-500/[0.07]',
      text: 'group-hover:text-indigo-300',
    },
    pm: {
      card: 'bg-violet-500/[0.03] border-violet-500/[0.12] hover:border-violet-500/30 hover:bg-violet-500/[0.07]',
      text: 'group-hover:text-violet-300',
    },
    consulting: {
      card: 'bg-emerald-500/[0.03] border-emerald-500/[0.12] hover:border-emerald-500/30 hover:bg-emerald-500/[0.07]',
      text: 'group-hover:text-emerald-300',
    },
    advocacy: {
      card: 'bg-rose-500/[0.03] border-rose-500/[0.12] hover:border-rose-500/30 hover:bg-rose-500/[0.07]',
      text: 'group-hover:text-rose-300',
    },
  };
  const s = styles[variant];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.055 }}
      whileHover={{ y: -3 }}
      className={`px-3.5 py-3 border rounded-xl cursor-default transition-all duration-250 group ${s.card}`}
    >
      <p className={`text-sm font-medium text-white ${s.text} transition-colors duration-250`}>
        {skill.name}
      </p>
      <p className="text-[10px] text-zinc-700 mt-0.5 uppercase tracking-wider">{skill.subcategory}</p>
    </motion.div>
  );
}

const columnDefs: {
  category: string;
  variant: Variant;
  label: string;
  dotColor: string;
  textColor: string;
  defaults: Skill[];
  delay: number;
}[] = [
  { category: 'tech',       variant: 'tech',       label: 'Software Engineering',    dotColor: 'bg-indigo-500',  textColor: 'text-indigo-400',  defaults: DEFAULT_TECH,       delay: 0 },
  { category: 'pm',         variant: 'pm',         label: 'Project Management',      dotColor: 'bg-violet-500',  textColor: 'text-violet-400',  defaults: DEFAULT_PM,         delay: 0.1 },
  { category: 'consulting', variant: 'consulting', label: 'Business Consultancy',    dotColor: 'bg-emerald-500', textColor: 'text-emerald-400', defaults: DEFAULT_CONSULTING, delay: 0.2 },
  { category: 'advocacy',   variant: 'advocacy',   label: 'Human Rights Advocacy',  dotColor: 'bg-rose-500',    textColor: 'text-rose-400',    defaults: DEFAULT_ADVOCACY,   delay: 0.3 },
];

export default function Skills({ skills }: Props) {
  return (
    <section id="skills" className="py-20 px-6 bg-[#0d0d10]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">02</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Skills</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-10">
          {columnDefs.map((col) => {
            const filtered = skills.filter((s) => s.category === col.category);
            const list = filtered.length ? filtered : col.defaults;
            return (
              <div key={col.category}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: col.delay }}
                  className="flex items-center gap-3 mb-5"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
                  <h3 className={`text-xs uppercase tracking-[3px] ${col.textColor} font-semibold`}>{col.label}</h3>
                </motion.div>
                <div className="grid grid-cols-2 gap-2.5">
                  {list.map((s, i) => <SkillCard key={s.id} skill={s} index={i} variant={col.variant} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
