'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ContactModal from './ContactModal';

type Props = {
  fullName: string;
  avatarUrl?: string | null;
};

const SECTION_IDS = ['about', 'services', 'skills', 'resume', 'portfolio', 'clients', 'testimonials'];

const navLinks = [
  { label: 'About',        href: '#about',        sectionId: 'about'        },
  { label: 'Services',     href: '#services',     sectionId: 'services'     },
  { label: 'Skills',       href: '#skills',       sectionId: 'skills'       },
  { label: 'Resume',       href: '#resume',       sectionId: 'resume'       },
  { label: 'Portfolio',    href: '#portfolio',    sectionId: 'portfolio'    },
  { label: 'Clients',      href: '#clients',      sectionId: 'clients'      },
  { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
  { label: 'Blog',         href: '/blog',         sectionId: null           },
  { label: 'Gallery',      href: '/gallery',      sectionId: null           },
];

function NavLogo({ fullName, avatarUrl }: Props) {
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <a href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/40 shrink-0 bg-indigo-600 flex items-center justify-center">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={fullName} width={56} height={56} className="w-full h-full object-cover" unoptimized />
        ) : (
          <span className="text-white text-xs font-bold tracking-wide">{initials}</span>
        )}
      </div>
      <span className="text-sm font-bold text-white uppercase tracking-widest leading-none">
        {fullName}
      </span>
    </a>
  );
}

export default function Navigation({ fullName, avatarUrl }: Props) {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Active section via IntersectionObserver (homepage only)
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Resolve href: anchor links become /#section when not on homepage
  function resolveHref(link: typeof navLinks[number]) {
    if (!link.sectionId) return link.href; // /blog, /gallery
    return isHome ? link.href : `/${link.href}`;
  }

  function isActive(link: typeof navLinks[number]) {
    if (!link.sectionId) return pathname === link.href;
    return isHome && activeSection === link.sectionId;
  }

  const linkBase = 'text-[13px] font-medium tracking-wide transition-colors duration-200';
  const linkIdle = 'text-zinc-300 hover:text-white';
  const linkActive = 'text-indigo-400';

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#09090b]/92 backdrop-blur-xl border-b border-white/[0.07]' : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 md:px-10 xl:px-16 py-3.5 flex items-center justify-between">
          <NavLogo fullName={fullName} avatarUrl={avatarUrl} />

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link);
              const href   = resolveHref(link);
              const cls    = `${linkBase} ${active ? linkActive : linkIdle}`;
              const inner  = (
                <span className="relative">
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-indigo-500/70" />
                  )}
                </span>
              );
              return link.sectionId && isHome ? (
                <a key={link.href} href={href} className={cls}>{inner}</a>
              ) : (
                <Link key={link.href} href={href} className={cls}>{inner}</Link>
              );
            })}

            <motion.button
              type="button"
              onClick={() => setContactOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-1.5 text-[13px] border border-indigo-500/50 text-indigo-300 rounded-full hover:bg-indigo-500 hover:text-white font-semibold transition-all duration-300"
            >
              Contact
            </motion.button>
          </div>

          <button
            className="md:hidden text-zinc-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-[#111113]/98 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link);
                const href   = resolveHref(link);
                const inner = (
                  <span className={`flex items-center gap-2 py-2.5 border-b border-white/[0.04] last:border-0 text-sm font-medium transition-colors ${active ? 'text-indigo-400' : 'text-zinc-200 hover:text-white'}`}>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                    {link.label}
                  </span>
                );
                return link.sectionId && isHome ? (
                  <a key={link.href} href={href} onClick={() => setMenuOpen(false)}>{inner}</a>
                ) : (
                  <Link key={link.href} href={href} onClick={() => setMenuOpen(false)}>{inner}</Link>
                );
              })}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setContactOpen(true); }}
                className="mt-2 py-2.5 text-sm text-center border border-indigo-500/50 text-indigo-300 rounded-full font-semibold"
              >
                Get In Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
