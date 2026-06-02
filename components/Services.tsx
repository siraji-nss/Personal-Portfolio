'use client';

import { motion } from 'framer-motion';
import {
  Briefcase, Code2, Megaphone, ClipboardList, HeartHandshake, Server,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@prisma/client';

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase, Code2, Megaphone, ClipboardList, HeartHandshake, Server,
};

type Props = { services: Service[] };

const DEFAULT_SERVICES: Service[] = [
  { id: '1', number: '01', icon: 'Briefcase',    title: 'Business Consultation',        description: 'Strategic guidance for digital transformation, market entry, and operational efficiency.', tags: ['Strategy', 'Advisory', 'Market Entry'], order: 0 },
  { id: '2', number: '02', icon: 'Code2',        title: 'Web & App Development',        description: 'End-to-end development of web platforms and mobile applications — from lean MVPs to enterprise-grade systems.', tags: ['Next.js', 'Flutter', 'Node.js'], order: 1 },
  { id: '3', number: '03', icon: 'Megaphone',    title: 'Digital Marketing & Branding', description: 'Brand identity, content marketing, and performance campaigns that drive measurable growth.', tags: ['Brand Strategy', 'SEO', 'Campaigns'], order: 2 },
  { id: '4', number: '04', icon: 'ClipboardList',title: 'Project Management',           description: 'Agile and structured PM for complex, multi-team software projects — ensuring on-time delivery.', tags: ['Agile', 'Cross-functional', 'Delivery'], order: 3 },
  { id: '5', number: '05', icon: 'HeartHandshake',title: 'Human Rights Activities',     description: 'Leveraging technology and advocacy through the Bangladesh Human Rights Enforcement Foundation.', tags: ['Advocacy', 'Legal', 'Social Impact'], order: 4 },
  { id: '6', number: '06', icon: 'Server',       title: 'Server & Infrastructure',      description: 'DigitalOcean provisioning, CI/CD pipelines, database management, and performance optimisation.', tags: ['DigitalOcean', 'DevOps', 'Performance'], order: 5 },
];

function ServiceCard({ svc, index }: { svc: Service; index: number }) {
  const Icon = ICON_MAP[svc.icon] ?? Briefcase;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative p-6 bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden cursor-default hover:border-indigo-500/20 transition-colors duration-400"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
           style={{ background: 'radial-gradient(circle at top left, rgba(99,102,241,0.04), transparent 65%)' }} />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/15 flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-colors duration-300">
          <Icon size={18} className="text-indigo-400" />
        </div>
        <span className="text-[10px] text-zinc-700 font-mono mb-1.5 block">{svc.number}</span>
        <h3 className="text-sm font-semibold text-white mb-2.5 group-hover:text-indigo-300 transition-colors duration-300 leading-snug">
          {svc.title}
        </h3>
        <p className="text-zinc-600 text-[13px] leading-relaxed mb-5">{svc.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {svc.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-700 border border-white/[0.06] rounded-full group-hover:border-indigo-500/20 group-hover:text-indigo-400/60 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services({ services }: Props) {
  const display = services.length ? services : DEFAULT_SERVICES;
  return (
    <section id="services" className="py-20 px-6 bg-[#09090b]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">02</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Services</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-lg"
          >
            What I bring to the table
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 max-w-xl text-[14px] leading-relaxed"
          >
            A full spectrum — from engineering to executive leadership.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {display.map((svc, i) => <ServiceCard key={svc.id} svc={svc} index={i} />)}
        </div>
      </div>
    </section>
  );
}
