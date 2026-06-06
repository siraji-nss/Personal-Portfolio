import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Star, Zap, Briefcase, User, GraduationCap, FolderKanban, Users, ArrowRight, Info, BarChart2, BookOpen, Image, Award, Settings2, Inbox } from 'lucide-react';

async function getCounts() {
  const [skills, services, experiences, education, projects, clients, stats, blog, gallery, training, inboxUnread] = await Promise.all([
    prisma.skill.count(),
    prisma.service.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.project.count(),
    prisma.client.count(),
    prisma.stat.count(),
    prisma.blogPost.count(),
    prisma.galleryPost.count(),
    prisma.training.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  return { skills, services, experiences, education, projects, clients, stats, blog, gallery, training, inboxUnread };
}

const sections = [
  { href: '/admin/inbox',      label: 'Inbox',       icon: Inbox,         desc: 'Contact form messages from visitors' },
  { href: '/admin/hero',       label: 'Hero',        icon: Star,          desc: 'Photo, name, typing texts, status badge' },
  { href: '/admin/about',      label: 'About',       icon: Info,          desc: 'Bio, headline, CV link, bento cards' },
  { href: '/admin/stats',      label: 'Stats',       icon: BarChart2,     desc: 'Numbers shown in the About section' },
  { href: '/admin/skills',     label: 'Skills',      icon: Zap,           desc: 'Tech & PM skill lists' },
  { href: '/admin/services',   label: 'Services',    icon: Briefcase,     desc: 'What you offer' },
  { href: '/admin/experience', label: 'Experience',  icon: User,          desc: 'Work history & projects' },
  { href: '/admin/education',  label: 'Education',   icon: GraduationCap, desc: 'Academic background' },
  { href: '/admin/projects',   label: 'Projects',    icon: FolderKanban,  desc: 'Portfolio grid items' },
  { href: '/admin/clients',    label: 'Clients',     icon: Users,         desc: 'Filterable client logos' },
  { href: '/admin/blog',       label: 'Blog',        icon: BookOpen,      desc: 'Blog posts and categories' },
  { href: '/admin/gallery',    label: 'Gallery',     icon: Image,         desc: 'Photo and video gallery posts' },
  { href: '/admin/training',   label: 'Training',    icon: Award,         desc: 'Training & certifications' },
  { href: '/admin/footer',     label: 'Footer',      icon: Settings2,     desc: 'Footer tagline, description, copyright' },
];

export default async function AdminDashboard() {
  const counts = await getCounts();
  const countMap: Record<string, { count: number; label?: string }> = {
    '/admin/inbox':      { count: counts.inboxUnread, label: counts.inboxUnread > 0 ? `${counts.inboxUnread} unread` : 'no new' },
    '/admin/skills':     { count: counts.skills },
    '/admin/services':   { count: counts.services },
    '/admin/experience': { count: counts.experiences },
    '/admin/education':  { count: counts.education },
    '/admin/projects':   { count: counts.projects },
    '/admin/clients':    { count: counts.clients },
    '/admin/stats':      { count: counts.stats },
    '/admin/blog':       { count: counts.blog },
    '/admin/gallery':    { count: counts.gallery },
    '/admin/training':   { count: counts.training },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-zinc-500">Manage all portfolio content from here.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}
            className="group p-5 bg-white/[0.025] border border-white/[0.07] rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Icon size={16} className="text-indigo-400" />
              </div>
              {countMap[href] !== undefined && (
                <span className={`text-xs font-mono ${
                  href === '/admin/inbox' && countMap[href].count > 0
                    ? 'text-indigo-400 font-semibold'
                    : 'text-zinc-600'
                }`}>
                  {countMap[href].label ?? `${countMap[href].count} items`}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{label}</p>
            <p className="text-xs text-zinc-600">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-zinc-700 group-hover:text-indigo-400 transition-colors">
              Manage <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
