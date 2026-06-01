'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, type LucideIcon } from 'lucide-react';

const education = [
  {
    Icon: GraduationCap,
    type: 'University',
    year: '2021',
    degree: 'Bachelor of Science in Computer Science & Engineering',
    institution: 'North South University',
    highlight: true,
  },
  {
    Icon: BookOpen,
    type: 'Higher Secondary (HSC)',
    year: '2014',
    degree: 'HSC — Science',
    institution: 'Dhaka Residential Model College',
    highlight: false,
  },
  {
    Icon: BookOpen,
    type: 'Secondary (SSC)',
    year: '2012',
    degree: 'SSC — Science',
    institution: 'Dhaka Residential Model College',
    highlight: false,
  },
];

export default function Education() {
  return (
    <section id="education" className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs uppercase tracking-[4px] text-[#2DD4BF] font-semibold">04</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Education</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-16"
        >
          Academic Foundation
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {education.map((edu, i) => {
            const { Icon } = edu;
            return (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.28 } }}
                className={`group p-8 rounded-2xl border transition-all duration-500 cursor-default ${
                  edu.highlight
                    ? 'bg-[#2DD4BF]/[0.04] border-[#2DD4BF]/20 hover:border-[#2DD4BF]/35'
                    : 'bg-white/[0.02] border-white/[0.07] hover:border-[#2DD4BF]/18'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-7 transition-colors duration-300 ${
                    edu.highlight
                      ? 'bg-[#2DD4BF]/15 border border-[#2DD4BF]/25 group-hover:bg-[#2DD4BF]/22'
                      : 'bg-white/[0.04] border border-white/[0.08] group-hover:bg-[#2DD4BF]/10 group-hover:border-[#2DD4BF]/15'
                  }`}
                >
                  <Icon size={20} className="text-[#2DD4BF]" />
                </div>

                {/* Metadata */}
                <span className="text-[10px] uppercase tracking-[3px] text-zinc-600 mb-3 block">
                  {edu.type} · {edu.year}
                </span>

                {/* Degree */}
                <h3 className="text-[15px] font-semibold text-white mb-2 leading-snug group-hover:text-[#2DD4BF] transition-colors duration-300">
                  {edu.degree}
                </h3>

                {/* Institution */}
                <p className="text-sm text-zinc-500">{edu.institution}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
