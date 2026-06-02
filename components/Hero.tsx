'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle, Linkedin, X, Mail } from 'lucide-react';
import type { HeroConfig } from '@prisma/client';
import ContactModal from './ContactModal';

type Props = { heroConfig: HeroConfig | null };

const DEFAULT_TEXTS = ['Software Engineer', 'Technical Project Manager', 'Entrepreneur', 'Human Rights Activist'];

function useTypingAnimation(texts: string[]) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 60);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 35);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    setDisplayText(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return displayText;
}

function fadeUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as number[] } },
  };
}

export default function Hero({ heroConfig }: Props) {
  const texts = heroConfig?.typingTexts?.length ? heroConfig.typingTexts : DEFAULT_TEXTS;
  const typedText = useTypingAnimation(texts);
  const [modalOpen, setModalOpen]         = useState(false);
  const [contactOpen, setContactOpen]     = useState(false);

  const fullName       = heroConfig?.fullName       ?? 'Nazmus Sakib Siraji';
  const heroImageUrl   = heroConfig?.heroImageUrl   ?? null;
  const statusBadge    = heroConfig?.statusBadge    ?? 'Open to new opportunities';
  const primaryTitle      = heroConfig?.primaryTitle      ?? 'Software Engineer & Technical PM';
  const primaryCompany    = heroConfig?.primaryCompany    ?? 'Arbree Limited';
  const primaryCompanyUrl = heroConfig?.primaryCompanyUrl ?? null;
  const secondaryLines = heroConfig?.secondaryLines?.length
    ? heroConfig.secondaryLines
    : ['Founder & CEO · Technonix', 'Joint Secretary · Bangladesh Human Rights Enforcement Foundation'];
  const linkedinUrl    = heroConfig?.linkedinUrl    ?? null;
  const whatsappNumber = heroConfig?.whatsappNumber ?? null;
  const officeAddress  = heroConfig?.officeAddress  ?? null;
  const officeMapUrl   = heroConfig?.officeMapUrl   ?? null;
  const primaryEmail   = heroConfig?.primaryEmail   ?? null;
  const hasSocial = officeAddress || whatsappNumber || linkedinUrl;

  return (
    <>
      <section id="hero" className="relative min-h-screen overflow-hidden bg-[#09090b]">

        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_30%_50%,transparent_40%,#09090b_100%)]" />

        {/* ── RIGHT: full-height photo, absolutely positioned ── */}
        <motion.div
          className="absolute inset-y-0 right-0 w-[50%] hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          {heroImageUrl ? (
            <>
              <Image
                src={heroImageUrl}
                alt={fullName}
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
              {/* Left blend — merges photo into dark background */}
              <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
              {/* Top blend */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#09090b] to-transparent" />
              {/* Bottom blend */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent" />
            </>
          ) : (
            /* Placeholder when no photo is uploaded */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-4xl font-black">
                {fullName.split(' ').slice(0, 2).map((w: string) => w[0]).join('')}
              </div>
              <a href="/admin/hero" className="text-xs text-indigo-500/60 hover:text-indigo-400 transition-colors">
                Upload hero photo →
              </a>
            </div>
          )}
        </motion.div>

        {/* ── LEFT: content, vertically centred ── */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-8 md:px-12 xl:px-16 2xl:px-20 py-28">
            <div className="max-w-[580px]">

              {/* Status badge */}
              <motion.div
                variants={fadeUp(0.1)}
                initial="hidden"
                animate="show"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-7 rounded-full bg-indigo-500/[0.08] border border-indigo-500/25 text-indigo-400 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {statusBadge}
              </motion.div>

              {/* Welcome line */}
              <motion.p
                variants={fadeUp(0.18)}
                initial="hidden"
                animate="show"
                className="text-zinc-500 text-xs uppercase tracking-[4px] mb-4"
              >
                Welcome to my world
              </motion.p>

              {/* "Hi, I'm [Name]" — single line */}
              <motion.h1
                variants={fadeUp(0.26)}
                initial="hidden"
                animate="show"
                className="font-black tracking-tight text-white leading-none mb-3 whitespace-nowrap"
                style={{ fontSize: 'clamp(28px, 3.8vw, 52px)' }}
              >
                Hi, I&apos;m{' '}
                <span className="text-gradient">{fullName}</span>
              </motion.h1>

              {/* Typing animation line */}
              <motion.div
                variants={fadeUp(0.35)}
                initial="hidden"
                animate="show"
                className="flex items-center mb-6"
                style={{ fontSize: 'clamp(22px, 2.8vw, 38px)' }}
              >
                <span className="font-bold text-white">a&nbsp;</span>
                <span className="font-bold text-white">{typedText}</span>
                <span className="inline-block w-[3px] bg-indigo-400 ml-1 cursor-blink" style={{ height: 'clamp(22px, 2.8vw, 38px)' }} />
              </motion.div>

              {/* Intro paragraph — only shown when saved */}
              {heroConfig?.introPara?.trim() && (
                <motion.p
                  variants={fadeUp(0.42)}
                  initial="hidden"
                  animate="show"
                  className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-[480px]"
                >
                  {heroConfig.introPara}
                </motion.p>
              )}

              {/* Primary title + company */}
              <motion.p
                variants={fadeUp(0.45)}
                initial="hidden"
                animate="show"
                className="text-base text-zinc-300 font-medium mb-1"
              >
                {primaryTitle} at{' '}
                {primaryCompanyUrl ? (
                  <Link
                    href={primaryCompanyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-500/40 hover:decoration-indigo-400 transition-colors"
                  >
                    {primaryCompany}
                  </Link>
                ) : (
                  <span className="text-indigo-400">{primaryCompany}</span>
                )}
              </motion.p>

              {/* Secondary lines */}
              <div className="mb-8 space-y-1">
                {secondaryLines.map((line: string, i: number) => (
                  <motion.p
                    key={i}
                    variants={fadeUp(0.52 + i * 0.06)}
                    initial="hidden"
                    animate="show"
                    className="text-sm text-zinc-500"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* CTA buttons */}
              <motion.div
                variants={fadeUp(0.62)}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-3 mb-10"
              >
                <motion.a
                  href="#portfolio"
                  whileHover={{ y: -2, boxShadow: '0 0 28px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-200"
                >
                  View Portfolio
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 border border-white/10 text-zinc-300 rounded-full text-sm tracking-wide hover:text-white transition-all duration-200"
                >
                  Get In Touch
                </motion.button>
              </motion.div>

              {/* Find with me */}
              {hasSocial && (
                <motion.div
                  variants={fadeUp(0.70)}
                  initial="hidden"
                  animate="show"
                  className="pt-7 border-t border-white/[0.06]"
                >
                  <p className="text-[10px] uppercase tracking-[3px] text-zinc-500 mb-5 font-semibold">Find with me</p>
                  <div className="flex gap-4">
                    {officeAddress && (
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        title="Office Address"
                        className="w-[72px] h-[72px] bg-[#1a1a22] border border-white/[0.08] rounded-2xl flex items-center justify-center text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-200"
                      >
                        <MapPin size={26} />
                      </button>
                    )}
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp"
                        className="w-[72px] h-[72px] bg-[#1a1a22] border border-white/[0.08] rounded-2xl flex items-center justify-center text-zinc-400 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/10 transition-all duration-200"
                      >
                        <MessageCircle size={26} />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        className="w-[72px] h-[72px] bg-[#1a1a22] border border-white/[0.08] rounded-2xl flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                      >
                        <Linkedin size={26} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {primaryEmail && (
                <motion.div variants={fadeUp(0.78)} initial="hidden" animate="show" className="mt-4">
                  <a href={`mailto:${primaryEmail}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                    <Mail size={12} />
                    {primaryEmail}
                  </a>
                </motion.div>
              )}

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[9px] uppercase tracking-[4px] text-zinc-700">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }}
          />
        </motion.div>

      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Office Address Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111115] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-400" />
                  Office Address
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{officeAddress}</p>
                {officeMapUrl && (
                  <a
                    href={officeMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <MapPin size={11} /> View on Google Maps
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
