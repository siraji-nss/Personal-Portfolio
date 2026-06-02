'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Experience, Education, Training } from '@prisma/client';

type Props = { experiences: Experience[]; education: Education[]; trainings: Training[] };

const DEFAULT_EXP: Experience[] = [
  { id: '1', period: 'Sep 2024 – Present', startDate: new Date('2024-09-01'), endDate: null, role: 'Technical Project Manager', company: 'Arbree Solutions', description: 'Managing multiple software operations, overseeing product planning and implementation, and maintaining active communication with clients across global markets.', projects: ['Virtual education platform for Planet Education Network (UK)', 'Sportigy — sportsman marketplace', 'Mobile app for ChargeAI', 'Export-import analytical tool for UAE Customs', 'HRM software for Munshi Group'], note: 'Coordinating Dubai & UK operations.', isCurrent: true, order: 0 },
  { id: '2', period: 'Jan 2024 – Aug 2024', startDate: new Date('2024-01-01'), endDate: new Date('2024-08-31'), role: 'Senior Executive, Project Management', company: 'OPUS Technology Limited', description: 'Oversaw product implementation and client communication for global operations spanning Africa, South Asia, and Southeast Asia.', projects: ['Microfinance platform in Uganda, Kenya & Zambia', 'Core banking software for Lanka Bangla Finance Ltd.', 'E-learning platform for Pro-Edge Pundit', 'License application software for Malaysian government'], note: 'Coordinated Dubai & Malaysian operations.', isCurrent: false, order: 1 },
  { id: '3', period: 'Jun 2023 – Dec 2023', startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), role: 'Executive, Project Management', company: 'HyperTAG Solutions Ltd.', description: 'Managed Belancer product and launched innovative accounting software. Directed a joint venture TVC with Apple Soft IT.', projects: ['Belancer — freelance marketplace', 'Cyber Security Training for Government Officials (World Bank aligned)'], note: null, isCurrent: false, order: 2 },
  { id: '4', period: 'Jun 2022 – May 2023', startDate: new Date('2022-06-01'), endDate: new Date('2023-05-31'), role: 'Software Engineer', company: 'Masleap Inc.', description: 'Developed cross-platform mobile and web applications using Laravel, Kotlin, and Flutter for international product teams.', projects: ['Android app for Horseracing Integrity & Safety Authority (USA)', 'Cross-platform app for Inkistry', 'TripBeyond — flight booking software'], note: null, isCurrent: false, order: 3 },
  { id: '5', period: 'Jul 2019 – May 2022', startDate: new Date('2019-07-01'), endDate: new Date('2022-05-31'), role: 'Software Developer → Operation Manager', company: 'Koderden Technologies Ltd.', description: 'Progressed from software developer to operations leadership, streamlining workflows and improving project delivery.', projects: ['Job Link Corporate', 'EuroBangla Times', 'Tolet Management System'], note: null, isCurrent: false, order: 4 },
  { id: '6', period: 'Apr 2015 – Jun 2019', startDate: new Date('2015-04-01'), endDate: new Date('2019-06-30'), role: 'Operation Executive', company: 'Opro Infotech LTD', description: 'Managed project timelines, budgets, and quality standards. Implemented operational efficiency strategies.', projects: [], note: null, isCurrent: false, order: 5 },
];

const DEFAULT_EDU: Education[] = [
  { id: '1', type: 'University', year: '2021', degree: 'BSc in Computer Science & Engineering', institution: 'North South University', highlight: true, order: 0 },
  { id: '2', type: 'Higher Secondary (HSC)', year: '2014', degree: 'HSC — Science', institution: 'Dhaka Residential Model College', highlight: false, order: 1 },
  { id: '3', type: 'Secondary (SSC)', year: '2012', degree: 'SSC — Science', institution: 'Dhaka Residential Model College', highlight: false, order: 2 },
];

function ExpCard({ exp, index }: { exp: Experience; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative pl-5 pb-8 last:pb-0"
    >
      {/* timeline dot */}
      <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 z-10 ${exp.isCurrent ? 'bg-indigo-500 border-indigo-500' : 'bg-[#09090b] border-white/20'}`} />
      {/* line */}
      {index < 5 && <div className="absolute left-[4px] top-4 bottom-0 w-px bg-white/[0.05]" />}

      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full mb-2 border ${exp.isCurrent ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/[0.03] text-zinc-600 border-white/[0.06]'}`}>
        {exp.isCurrent && <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />}
        {exp.period}
      </span>
      <h4 className="text-[15px] font-semibold text-white mb-0.5 leading-snug">{exp.role}</h4>
      <p className="text-xs text-indigo-400/80 font-medium mb-2">{exp.company}</p>
      <p className="text-zinc-600 text-[13px] leading-relaxed mb-2">{exp.description}</p>

      {exp.projects.length > 0 && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-[11px] text-zinc-700 hover:text-indigo-400 transition-colors mb-2"
          >
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} />
            </motion.span>
            {open ? 'Hide' : 'View'} projects ({exp.projects.length})
          </button>
          <motion.div
            initial={false}
            animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="space-y-1 pb-1">
              {exp.projects.map((p) => (
                <li key={p} className="flex items-start gap-1.5 text-[11px] text-zinc-600">
                  <span className="text-indigo-500 mt-0.5 shrink-0">›</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function EduCard({ edu, index }: { edu: Education; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-5 rounded-xl border mb-3 last:mb-0 ${edu.highlight ? 'bg-indigo-500/[0.04] border-indigo-500/20' : 'bg-white/[0.02] border-white/[0.07]'}`}
    >
      <span className="text-[10px] uppercase tracking-[2px] text-zinc-600 mb-2 block">{edu.type} · {edu.year}</span>
      <h4 className={`text-[14px] font-semibold mb-0.5 leading-snug ${edu.highlight ? 'text-indigo-300' : 'text-white'}`}>{edu.degree}</h4>
      <p className="text-xs text-zinc-500">{edu.institution}</p>
    </motion.div>
  );
}

function TrainingCard({ training, index }: { training: Training; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-5 rounded-xl border mb-3 last:mb-0 bg-white/[0.02] border-white/[0.07]"
    >
      <span className="text-[10px] uppercase tracking-[2px] text-zinc-600 mb-2 block">Training · {training.year}</span>
      <h4 className="text-[14px] font-semibold mb-0.5 leading-snug text-white">{training.title}</h4>
      <p className="text-xs text-zinc-500">{training.institution}</p>
      {training.description && (
        <p className="text-[12px] text-zinc-600 mt-2 leading-relaxed">{training.description}</p>
      )}
    </motion.div>
  );
}

export default function Resume({ experiences, education, trainings }: Props) {
  const exps = experiences.length ? experiences : DEFAULT_EXP;
  const edus = education.length ? education : DEFAULT_EDU;

  return (
    <section id="resume" className="py-20 px-6 bg-[#0d0d10]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">04</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">My Resume</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-14">
          {/* Left — Education + Trainings */}
          <div>
            <h3 className="text-xs uppercase tracking-[3px] text-zinc-500 mb-6 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Education Quality
            </h3>
            {edus.map((edu, i) => <EduCard key={edu.id} edu={edu} index={i} />)}

            {trainings.length > 0 && (
              <>
                <h3 className="text-xs uppercase tracking-[3px] text-zinc-500 mt-10 mb-6 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  Trainings
                </h3>
                {trainings.map((t, i) => <TrainingCard key={t.id} training={t} index={i} />)}
              </>
            )}
          </div>

          {/* Right — Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-[3px] text-zinc-500 mb-6 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Job Experience
            </h3>
            {exps.map((exp, i) => <ExpCard key={exp.id} exp={exp} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
