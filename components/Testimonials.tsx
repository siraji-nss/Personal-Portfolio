'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Testimonial } from '@prisma/client';

type Props = { testimonials: Testimonial[] };

const FALLBACK: Testimonial[] = [
  {
    id: '1', name: 'Sarah Johnson', designation: 'CTO', company: 'TechVenture Ltd',
    message: 'Working with Sakib was transformative for our product. His dual expertise in engineering and project management meant nothing fell through the cracks. Delivery was on time, on budget, and beyond expectations.',
    avatarUrl: null, isPublic: true, order: 0,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', name: 'Ahmed Al-Rashid', designation: 'CEO', company: 'GrowthAxis MENA',
    message: 'Sakib brought clarity to a chaotic codebase and turned it into a scalable platform. His communication was excellent throughout. I would hire him again without hesitation.',
    avatarUrl: null, isPublic: true, order: 1,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', name: 'Priya Nair', designation: 'Product Manager', company: 'EduSpark',
    message: 'The mobile app Sakib delivered exceeded our brief in every way. His attention to UX detail and his instinct for what users actually need is rare. A true full-stack partner.',
    avatarUrl: null, isPublic: true, order: 2,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

function Avatar({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const colors = [
    'from-indigo-500 to-violet-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-blue-500 to-cyan-600',
  ];
  const colorIdx = testimonial.name.charCodeAt(0) % colors.length;

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
      {testimonial.avatarUrl ? (
        <Image src={testimonial.avatarUrl} alt={testimonial.name} width={48} height={48}
          className="w-full h-full object-cover" unoptimized />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">{initials}</span>
        </div>
      )}
    </div>
  );
}

function TestimonialCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-indigo-500/20 hover:bg-white/[0.05] transition-all duration-300"
    >
      {/* Quote icon */}
      <Quote size={28} className="text-indigo-500/30 mb-4 shrink-0" />

      {/* Message */}
      <p className="text-zinc-300 text-[14px] leading-[1.85] flex-1 italic">
        &ldquo;{t.message}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
        <Avatar testimonial={t} />
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{t.name}</p>
          <p className="text-zinc-500 text-xs truncate">
            {t.designation}
            {t.company ? <span className="text-zinc-700"> · {t.company}</span> : null}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials({ testimonials }: Props) {
  const list = testimonials.length ? testimonials : FALLBACK;
  const PER_PAGE = 3;
  const totalPages = Math.ceil(list.length / PER_PAGE);

  const [page, setPage]         = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused]     = useState(false);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setPage((next + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-advance
  useEffect(() => {
    if (paused || totalPages <= 1) return;
    const id = setInterval(() => goTo(page + 1, 1), 5500);
    return () => clearInterval(id);
  }, [page, paused, totalPages, goTo]);

  const slide = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="py-20 px-6 bg-[#09090b]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} className="flex items-center gap-4 mb-4">
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">07</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Testimonials</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.05 }}
          className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-1.5">Feedback from clients &amp; collaborators</p>
          </div>

          {/* Navigation arrows */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => goTo(page - 1, -1)}
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-indigo-500/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => goTo(page + 1, 1)}
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-indigo-500/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Slider */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {slide.map((t, i) => (
                <TestimonialCard key={t.id} t={t} delay={i * 0.06} />
              ))}
              {/* Fill empty slots to keep grid stable */}
              {slide.length < PER_PAGE && [...Array(PER_PAGE - slide.length)].map((_, i) => (
                <div key={`empty-${i}`} className="hidden lg:block" />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > page ? 1 : -1)}
                className={`rounded-full transition-all duration-300 ${
                  i === page
                    ? 'w-6 h-2 bg-indigo-500'
                    : 'w-2 h-2 bg-white/[0.12] hover:bg-white/25'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
