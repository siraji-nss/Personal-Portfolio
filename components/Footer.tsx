'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Linkedin, MessageCircle, ExternalLink, MapPin,
  ArrowUpRight, ChevronRight,
} from 'lucide-react';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import ContactModal from './ContactModal';
import type { FooterConfig, HeroConfig } from '@prisma/client';

type OrgEmail = { email: string; name: string };

type Props = {
  footerConfig: FooterConfig | null;
  heroConfig: HeroConfig | null;
};

const quickLinks = [
  { label: 'About',        href: '#about' },
  { label: 'Services',     href: '#services' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Resume',       href: '#resume' },
  { label: 'Portfolio',    href: '#portfolio' },
  { label: 'Clients',      href: '#clients' },
  { label: 'Testimonials', href: '#testimonials' },
];

const moreLinks = [
  { label: 'Blog',     href: '/blog',    external: true },
  { label: 'Gallery',  href: '/gallery', external: true },
  { label: 'Submit a Testimonial', href: '/testimonials/submit', external: false },
];

function FooterLinkRow({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const inner = (
    <span className="flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-indigo-400 transition-colors group">
      <ChevronRight size={12} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
      {label}
      {external && <ArrowUpRight size={10} className="opacity-50" />}
    </span>
  );
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <a href={href}>{inner}</a>;
}

export default function Footer({ footerConfig, heroConfig }: Props) {
  const [contactOpen, setContactOpen] = useState(false);
  const year = new Date().getFullYear();

  const tagline       = footerConfig?.tagline      ?? 'Building technology with purpose.';
  const designation   = footerConfig?.designation  ?? 'Software Engineer & TPM';
  const description   = footerConfig?.description  ?? "Whether you need a technical partner, a project manager, or a strategic advisor — I'm always open to discussing how we can create meaningful impact.";
  const copyrightName = footerConfig?.copyrightName ?? 'Nazmus Sakib Siraji';

  const fullName       = heroConfig?.fullName       ?? 'Nazmus Sakib Siraji';
  const linkedinUrl    = heroConfig?.linkedinUrl    ?? null;
  const whatsappNumber = heroConfig?.whatsappNumber ?? null;
  const twitterUrl     = heroConfig?.twitterUrl    ?? null;
  const primaryEmail   = heroConfig?.primaryEmail   ?? null;
  const officeAddress  = heroConfig?.officeAddress  ?? null;
  const avatarUrl      = heroConfig?.avatarUrl      ?? null;
  const orgEmails: OrgEmail[] = Array.isArray(heroConfig?.orgEmails)
    ? (heroConfig?.orgEmails as OrgEmail[]) : [];

  return (
    <>
      <footer id="contact" className="bg-[#09090b] relative overflow-hidden">

        {/* Decorative top gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Subtle radial glow */}
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 pt-16 pb-12">

          {/* Section label */}
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} className="flex items-center gap-4 mb-14">
            <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">10</span>
            <span className="text-xs uppercase tracking-[4px] text-zinc-600">Get In Touch</span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </motion.div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* ── Col 1: Brand ─────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="lg:col-span-1 space-y-5">

              {/* Logo + name */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500/30 shrink-0 bg-indigo-600 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={fullName} width={44} height={44}
                      className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {fullName.split(' ').slice(0, 2).map(w => w[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{fullName}</p>
                  <p className="text-indigo-400 text-[11px] tracking-wider">{designation}</p>
                </div>
              </div>

              <p className="text-[13px] text-zinc-500 leading-relaxed">{description}</p>

              {/* Say Hello button (swapped from Col 4) */}
              <motion.button
                type="button"
                onClick={() => setContactOpen(true)}
                whileHover={{ y: -2, boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-200"
              >
                Say Hello <ExternalLink size={13} />
              </motion.button>
            </motion.div>

            {/* ── Col 2: Quick Links ───────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <p className="text-[11px] uppercase tracking-[3px] text-zinc-600 font-semibold mb-5">Quick Links</p>
              <ul className="space-y-3">
                {quickLinks.map(l => (
                  <li key={l.href}><FooterLinkRow label={l.label} href={l.href} /></li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 3: More ──────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.14 }}>
              <p className="text-[11px] uppercase tracking-[3px] text-zinc-600 font-semibold mb-5">More</p>
              <ul className="space-y-3">
                {moreLinks.map(l => (
                  <li key={l.href}><FooterLinkRow label={l.label} href={l.href} external={l.external} /></li>
                ))}
              </ul>

              {orgEmails.length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-[3px] text-zinc-600 font-semibold mb-4">Org Emails</p>
                  <div className="space-y-3">
                    {orgEmails.map(o => (
                      <div key={o.email}>
                        <p className="text-[10px] text-zinc-700 mb-0.5 uppercase tracking-wider">{o.name}</p>
                        <a href={`mailto:${o.email}`}
                          className="text-[13px] text-zinc-500 hover:text-indigo-400 transition-colors">
                          {o.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Col 4: Contact CTA ───────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="space-y-5">
              <p className="text-[11px] uppercase tracking-[3px] text-zinc-600 font-semibold">Contact</p>

              <div>
                <h2 className="text-xl font-bold text-white leading-snug mb-1">{tagline}</h2>
                <p className="text-[13px] text-zinc-600">Let&apos;s build something great together.</p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all"
                    title="LinkedIn">
                    <Linkedin size={14} />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                    title="X (Twitter)">
                    <XIcon />
                  </a>
                )}
                {whatsappNumber && (
                  <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/[0.06] transition-all"
                    title="WhatsApp">
                    <MessageCircle size={14} />
                  </a>
                )}
                {primaryEmail && (
                  <a href={`mailto:${primaryEmail}`}
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] transition-all"
                    title="Email">
                    <Mail size={14} />
                  </a>
                )}
              </div>

              {primaryEmail && (
                <div className="flex items-start gap-2.5 pt-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={12} className="text-indigo-400" />
                  </div>
                  <a href={`mailto:${primaryEmail}`}
                    className="text-[13px] text-zinc-400 hover:text-indigo-400 transition-colors break-all">
                    {primaryEmail}
                  </a>
                </div>
              )}

              {officeAddress && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={12} className="text-indigo-400" />
                  </div>
                  <p className="text-[13px] text-zinc-500 whitespace-pre-line leading-relaxed">{officeAddress}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05]">
          <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-700">
              © {year} {copyrightName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/blog"    className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">Blog</Link>
              <Link href="/gallery" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">Gallery</Link>
              <a href="#" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">↑ Top</a>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
