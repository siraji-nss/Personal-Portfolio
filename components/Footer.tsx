'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ContactModal from './ContactModal';
import type { FooterConfig, HeroConfig } from '@prisma/client';

type OrgEmail = { email: string; name: string };

type Props = {
  footerConfig: FooterConfig | null;
  heroConfig: HeroConfig | null;
};

const navLinks = [
  { label: 'About',     href: '#about' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Services',  href: '#services' },
  { label: 'Resume',    href: '#resume' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Gallery',   href: '/gallery' },
];

export default function Footer({ footerConfig, heroConfig }: Props) {
  const [contactOpen, setContactOpen] = useState(false);
  const year = new Date().getFullYear();

  const tagline = footerConfig?.tagline ?? 'Building technology with purpose.';
  const description = footerConfig?.description ?? 'Whether you need a technical partner, a project manager, or a strategic advisor — I\'m always open to discussing how we can create meaningful impact.';
  const copyrightName = footerConfig?.copyrightName ?? 'Nazmus Sakib Siraji';

  const linkedinUrl    = heroConfig?.linkedinUrl    ?? null;
  const whatsappNumber = heroConfig?.whatsappNumber ?? null;
  const primaryEmail   = heroConfig?.primaryEmail   ?? null;
  const orgEmails: OrgEmail[] = Array.isArray(heroConfig?.orgEmails)
    ? (heroConfig?.orgEmails as OrgEmail[])
    : [];

  return (
    <>
      <footer id="contact" className="bg-[#09090b] border-t border-white/[0.05]">
        <div className="px-6 pt-20 pb-14 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-14 items-start">

            {/* Left column — tagline, description, nav links, copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">09</span>
                <span className="text-xs uppercase tracking-[4px] text-zinc-600">Get In Touch</span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {tagline}
              </h2>
              <p className="text-zinc-500 mb-8 leading-relaxed text-[14px]">
                {description}
              </p>

              <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>

            {/* Middle column — social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-5 lg:pt-16"
            >
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-700 mb-4">Connect</p>

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-zinc-400 hover:text-blue-400 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.06] transition-all">
                    <Linkedin size={14} />
                  </div>
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-zinc-400 hover:text-green-400 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center group-hover:border-green-500/30 group-hover:bg-green-500/[0.06] transition-all">
                    <MessageCircle size={14} />
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>
              )}

              {primaryEmail && (
                <a
                  href={`mailto:${primaryEmail}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-indigo-400 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center group-hover:border-indigo-500/30 group-hover:bg-indigo-500/[0.06] transition-all">
                    <Mail size={14} />
                  </div>
                  <span className="text-sm truncate">{primaryEmail}</span>
                </a>
              )}
            </motion.div>

            {/* Right column — Say Hello + org emails */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 lg:pt-16"
            >
              <motion.button
                type="button"
                onClick={() => setContactOpen(true)}
                whileHover={{ y: -2, boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-200"
              >
                Say Hello
                <ExternalLink size={13} />
              </motion.button>

              {orgEmails.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] text-zinc-700 mb-3">Org Emails</p>
                  <div className="space-y-3">
                    {orgEmails.map((o) => (
                      <div key={o.email}>
                        <p className="text-[11px] text-zinc-600 mb-0.5">{o.name}</p>
                        <a
                          href={`mailto:${o.email}`}
                          className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                        >
                          {o.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-zinc-700">© {year} {copyrightName}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Blog</Link>
              <Link href="/gallery" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Gallery</Link>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
