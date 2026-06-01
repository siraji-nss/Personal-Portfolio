'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from './ContactModal';

type Props = {
  fullName: string;
  avatarUrl?: string | null;
};

const navLinks = [
  { label: 'About',     href: '#about',     external: false },
  { label: 'Skills',    href: '#skills',    external: false },
  { label: 'Services',  href: '#services',  external: false },
  { label: 'Resume',    href: '#resume',    external: false },
  { label: 'Portfolio', href: '#portfolio', external: false },
  { label: 'Clients',   href: '#clients',   external: false },
  { label: 'Blog',      href: '/blog',      external: true  },
  { label: 'Gallery',   href: '/gallery',   external: true  },
];

function NavLogo({ fullName, avatarUrl }: Props) {
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <a href="#" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
      {/* Avatar circle */}
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/40 shrink-0 bg-indigo-600 flex items-center justify-center">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={fullName} width={56} height={56} className="w-full h-full object-cover" unoptimized />
        ) : (
          <span className="text-white text-xs font-bold tracking-wide">{initials}</span>
        )}
      </div>
      {/* Name */}
      <span className="text-sm font-bold text-white uppercase tracking-widest leading-none">
        {fullName}
      </span>
    </a>
  );
}

export default function Navigation({ fullName, avatarUrl }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.05]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <NavLogo fullName={fullName} avatarUrl={avatarUrl} />

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              link.external ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </a>
              )
            ))}
            <motion.button
              type="button"
              onClick={() => setContactOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-1.5 text-[13px] border border-indigo-500/40 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white font-medium transition-all duration-300"
            >
              Contact
            </motion.button>
          </div>

          <button
            className="md:hidden text-zinc-500 hover:text-white transition-colors"
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
            className="fixed top-[60px] left-0 right-0 z-40 bg-[#111113]/98 backdrop-blur-xl border-b border-white/[0.05] md:hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                link.external ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-400 hover:text-white text-sm py-1.5 border-b border-white/[0.04] last:border-0 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-zinc-400 hover:text-white text-sm py-1.5 border-b border-white/[0.04] last:border-0 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setContactOpen(true); }}
                className="mt-1 py-2.5 text-sm text-center border border-indigo-500/40 text-indigo-400 rounded-full font-medium"
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
