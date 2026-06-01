'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Star, Zap, Briefcase, GraduationCap,
  FolderKanban, Users, LogOut, ExternalLink, User, Info, BarChart2,
  BookOpen, Image, Award, Settings2,
} from 'lucide-react';

const links = [
  { href: '/admin',        label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero',   label: 'Hero',      icon: Star },
  { href: '/admin/about',  label: 'About',     icon: Info },
  { href: '/admin/stats',  label: 'Stats',     icon: BarChart2 },
  { href: '/admin/skills', label: 'Skills',    icon: Zap },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/experience', label: 'Experience', icon: User },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/blog',     label: 'Blog',     icon: BookOpen },
  { href: '/admin/gallery',  label: 'Gallery',  icon: Image },
  { href: '/admin/training', label: 'Training', icon: Award },
  { href: '/admin/footer',   label: 'Footer',   icon: Settings2 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#111113] border-r border-white/[0.06] flex flex-col z-50">
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <p className="text-xs uppercase tracking-[3px] text-zinc-600 mb-1">CMS</p>
        <p className="text-sm font-semibold text-white">Portfolio Admin</p>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
