'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type ExperienceEntry = {
  period: string;
  role: string;
  company: string;
  current: boolean;
  description: string;
  projects: string[];
  note?: string;
};

const experiences: ExperienceEntry[] = [
  {
    period: 'Sep 2024 – Present',
    role: 'Technical Project Manager',
    company: 'Arbree Solutions',
    current: true,
    description:
      'Managing multiple software operations, overseeing product planning and implementation, and maintaining active communication with clients across global markets.',
    projects: [
      'Virtual education platform for Planet Education Network (UK)',
      'Sportigy — sportsman marketplace',
      'Mobile app for ChargeAI',
      'Export-import analytical tool for UAE Customs',
      'Supply chain analytical tool for UK',
      'HRM software for Munshi Group',
      'Student management system for schools',
      'Custom OS development',
    ],
    note: 'Coordinating Dubai & UK operations; conducting in-depth research on internal software product development.',
  },
  {
    period: 'Jan 2024 – Aug 2024',
    role: 'Senior Executive, Project Management',
    company: 'OPUS Technology Limited',
    current: false,
    description:
      'Oversaw product implementation and client communication for global operations spanning Africa, South Asia, and Southeast Asia.',
    projects: [
      'Microfinance platform in Uganda, Kenya & Zambia (Murfin Inc.)',
      'Server management & BI reports (Teletalk)',
      'Core banking software for Lanka Bangla Finance Ltd.',
      'E-learning platform for Pro-Edge Pundit',
      'License application software for Malaysian government',
      'POS system for Malaysian hawkers',
      'Hospital & Islamic Banking solutions (planned)',
    ],
    note: 'Coordinated Dubai & Malaysian operations; researched East African software market to strategise entry.',
  },
  {
    period: 'Jun 2023 – Dec 2023',
    role: 'Executive, Project Management',
    company: 'HyperTAG Solutions Ltd. & Tecknovo',
    current: false,
    description:
      "Managed Belancer product and launched innovative accounting software. Directed a joint venture TVC with Apple Soft IT. Oversaw a World Bank-aligned cybersecurity training initiative.",
    projects: [
      'Belancer — freelance marketplace',
      'Joint venture TVC project with Apple Soft IT Ltd.',
      'Cyber Security Training for Government Officials (World Bank aligned)',
      'Hire & Train programme at Tecknovo Global Ltd.',
    ],
  },
  {
    period: 'Jun 2022 – May 2023',
    role: 'Software Engineer',
    company: 'Masleap Inc.',
    current: false,
    description:
      'Developed high-quality cross-platform mobile and web applications using Laravel, Kotlin, and Flutter for international product teams.',
    projects: [
      'Android app for Horseracing Integrity & Safety Authority (USA)',
      'Cross-platform app for Inkistry',
      'TripBeyond — flight booking software',
      "E-commerce platform for Eduera Limited",
      "Web software improvement for Global Skills Development Agency",
    ],
  },
  {
    period: 'Jul 2019 – May 2022',
    role: 'Software Developer → Operation Manager',
    company: 'Koderden Technologies Ltd.',
    current: false,
    description:
      'Progressed from software developer to operations leadership, streamlining workflows and improving project delivery across key digital products.',
    projects: [
      'Job Link Corporate',
      'EuroBangla Times',
      'Tolet Management System',
    ],
    note: 'Oversaw project and operational management, improving cross-team coordination and delivery processes.',
  },
  {
    period: 'Apr 2015 – Jun 2019',
    role: 'Operation Executive',
    company: 'Opro Infotech LTD',
    current: false,
    description:
      'Managed project timelines, budgets, and quality standards. Implemented operational efficiency strategies and developed plans for process improvement and resource optimisation.',
    projects: [],
  },
];

function TimelineItem({ exp, index }: { exp: ExperienceEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative pl-10 pb-14 last:pb-0"
    >
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.08 + 0.2 }}
        className={`absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full z-10 border-2 ${
          exp.current
            ? 'bg-[#2DD4BF] border-[#2DD4BF]'
            : 'bg-[#080808] border-[#2DD4BF]/40'
        }`}
      />

      {/* Connecting line */}
      {index < experiences.length - 1 && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: index * 0.08 + 0.3 }}
          className="absolute left-[6px] top-5 bottom-0 w-px"
          style={{ transformOrigin: 'top', background: 'linear-gradient(to bottom, rgba(45,212,191,0.25), rgba(255,255,255,0.03))' }}
        />
      )}

      {/* Content */}
      <div>
        {/* Period + current badge */}
        <div className="flex items-center flex-wrap gap-3 mb-3">
          <span
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-medium border ${
              exp.current
                ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20'
                : 'bg-white/[0.03] text-zinc-600 border-white/[0.06]'
            }`}
          >
            {exp.period}
          </span>
          {exp.current && (
            <span className="flex items-center gap-1.5 text-[10px] text-[#2DD4BF] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              Active
            </span>
          )}
        </div>

        {/* Role */}
        <h3 className="text-[17px] font-semibold text-white mb-1 leading-snug">{exp.role}</h3>

        {/* Company */}
        <p className="text-sm text-[#2DD4BF]/80 font-medium mb-4">{exp.company}</p>

        {/* Description */}
        <p className="text-zinc-500 text-sm leading-relaxed mb-4">{exp.description}</p>

        {/* Expandable projects */}
        {exp.projects.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#2DD4BF] transition-colors duration-200 mb-3"
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown size={13} />
              </motion.span>
              {expanded ? 'Hide' : 'View'} key projects ({exp.projects.length})
            </button>

            <motion.div
              initial={false}
              animate={expanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <ul className="space-y-1.5 pb-2">
                {exp.projects.map((project) => (
                  <li key={project} className="flex items-start gap-2 text-xs text-zinc-500">
                    <span className="text-[#2DD4BF] mt-0.5 shrink-0">›</span>
                    <span>{project}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}

        {/* Note */}
        {exp.note && (
          <p className="text-[11px] text-zinc-700 leading-relaxed mt-3 italic">{exp.note}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 bg-[#080808]">
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs uppercase tracking-[4px] text-[#2DD4BF] font-semibold">03</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Experience</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
        >
          Over a decade of{' '}
          <span className="text-gradient">building things that matter</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="text-zinc-500 mb-20 text-[15px] leading-relaxed"
        >
          From engineering code to leading global teams — a journey across industries, countries, and impact areas.
        </motion.p>

        <div>
          {experiences.map((exp, i) => (
            <TimelineItem key={`${exp.company}-${i}`} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
