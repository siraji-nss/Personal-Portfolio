'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@prisma/client';

type Props = { projects: Project[] };

const FILTERS = ['All', 'Technonix', 'Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'OproIT'];

const DEFAULT_PROJECTS: Project[] = [
  { id: '1', title: 'Virtual Education Platform', description: 'Comprehensive e-learning platform for Planet Education Network (UK) with live sessions, assessments, and progress tracking.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'Arbree', tags: ['Next.js', 'PostgreSQL', 'EdTech'], featured: true, order: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Microfinance Platform', description: 'Multi-country microfinance system deployed across Uganda, Kenya & Zambia for Murfin Inc. with mobile-first design.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'Opus', tags: ['Laravel', 'MySQL', 'FinTech'], featured: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Belancer Freelance Marketplace', description: 'Full-featured freelance marketplace connecting clients with skilled professionals.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'HyperTag', tags: ['Node.js', 'React', 'Marketplace'], featured: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', title: 'HISA Android App', description: 'Android application for the Horseracing Integrity & Safety Authority (USA) for regulatory compliance.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'Masleap', tags: ['Kotlin', 'Android', 'RegTech'], featured: false, order: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', title: 'TripBeyond Flight Booking', description: 'Cross-platform flight booking and travel management application with real-time availability.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'Masleap', tags: ['Flutter', 'Node.js', 'Travel'], featured: false, order: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', title: 'Job Link Corporate', description: 'Corporate job portal connecting employers and candidates with advanced filtering and matching.', imageUrl: null, liveUrl: null, githubUrl: null, company: 'Koderden', tags: ['Laravel', 'Vue.js', 'HRTech'], featured: false, order: 5, createdAt: new Date(), updatedAt: new Date() },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300"
    >
      {/* Image / Placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 overflow-hidden">
        {project.imageUrl ? (
          <Image src={project.imageUrl} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-indigo-400 text-lg font-bold">{project.title[0]}</span>
              </div>
              <span className="text-[10px] text-zinc-700 uppercase tracking-wider">{project.company}</span>
            </div>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
            {project.title}
          </h3>
          <div className="flex gap-1.5 shrink-0">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-indigo-400 transition-colors">
                <ExternalLink size={13} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-indigo-400 transition-colors">
                <Github size={13} />
              </a>
            )}
          </div>
        </div>
        <p className="text-zinc-600 text-[12px] leading-relaxed mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] text-zinc-600 bg-white/[0.03] border border-white/[0.06] rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const display = projects.length ? projects : DEFAULT_PROJECTS;
  const filtered = activeFilter === 'All' ? display : display.filter((p) => p.company === activeFilter);
  const usedCompanies = ['All', ...Array.from(new Set(display.map((p) => p.company)))];

  return (
    <section id="portfolio" className="py-20 px-6 bg-[#09090b]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">05</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">My Portfolio</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Selected Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-[14px] mb-7"
          >
            Projects across fintech, edtech, healthtech, and enterprise domains.
          </motion.p>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.filter((f) => usedCompanies.includes(f)).map((f) => (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileTap={{ scale: 0.95 }}
                className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider rounded-full border transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                    : 'text-zinc-600 border-white/[0.07] hover:text-zinc-300 hover:border-white/15'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-700 py-16 text-sm">No projects for this filter yet.</p>
        )}
      </div>
    </section>
  );
}
