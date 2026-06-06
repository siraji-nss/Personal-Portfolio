'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard, Star, Zap, Briefcase, GraduationCap,
  FolderKanban, Users, LogOut, ExternalLink, User, Info, BarChart2,
  BookOpen, Image, Award, Settings2, MessageSquareQuote, Menu, X, Inbox,
} from 'lucide-react';

const links = [
  { href: '/admin',              label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/inbox',        label: 'Inbox',         icon: Inbox },
  { href: '/admin/hero',         label: 'Hero',          icon: Star },
  { href: '/admin/about',        label: 'About',         icon: Info },
  { href: '/admin/stats',        label: 'Stats',         icon: BarChart2 },
  { href: '/admin/skills',       label: 'Skills',        icon: Zap },
  { href: '/admin/services',     label: 'Services',      icon: Briefcase },
  { href: '/admin/experience',   label: 'Experience',    icon: User },
  { href: '/admin/education',    label: 'Education',     icon: GraduationCap },
  { href: '/admin/projects',     label: 'Projects',      icon: FolderKanban },
  { href: '/admin/clients',      label: 'Clients',       icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials',  icon: MessageSquareQuote },
  { href: '/admin/blog',         label: 'Blog',          icon: BookOpen },
  { href: '/admin/gallery',      label: 'Gallery',       icon: Image },
  { href: '/admin/training',     label: 'Training',      icon: Award },
  { href: '/admin/footer',       label: 'Footer',        icon: Settings2 },
];

function SidebarContent({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <>
      <div className="px-5 py-6 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-zinc-600 mb-1">CMS</p>
          <p className="text-sm font-semibold text-white">Portfolio Admin</p>
        </div>
        {onNav && (
          <button onClick={onNav} className="lg:hidden text-zinc-600 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-zinc-300 rounded-lg hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={13} />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — fixed, always visible on lg+ */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-[#111113] border-r border-white/[0.06] flex-col z-50">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#111113] border-b border-white/[0.06] flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-zinc-500 hover:text-white transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <p className="text-sm font-semibold text-white">Portfolio Admin</p>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-[#111113] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onNav={() => setOpen(false)} />
      </aside>
    </>
  );
}
