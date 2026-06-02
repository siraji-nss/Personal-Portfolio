'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  // ── Business & Consulting ────────────────────────
  Briefcase, Building, Building2, ClipboardList, ClipboardCheck,
  FileText, Handshake, HeartHandshake, BarChart2, BarChart3, LineChart,
  PieChart, TrendingUp, TrendingDown, Target, Award, Star, Trophy, Medal,
  Megaphone, Globe, Globe2, MapPin, Users, User, UserCheck, UserPlus,
  Network, Lightbulb, BadgeCheck, ThumbsUp,
  // ── Finance ─────────────────────────────────────
  DollarSign, Coins, CreditCard, Banknote, Wallet, Receipt, PiggyBank,
  // ── Tech & Engineering ──────────────────────────
  Code, Code2, Terminal, Server, Database, Cloud, HardDrive,
  Cpu, Monitor, Laptop, Smartphone, Wifi, GitBranch, Layers, LayoutGrid,
  Wrench, Package, Rocket, Zap, Bot, Brain, Sparkles, Blocks,
  LayoutDashboard, Settings, Settings2,
  // ── Creative & Design ───────────────────────────
  Pen, Pencil, Palette, Paintbrush, Image, Camera, Film, Video, PenTool,
  // ── Communication & Marketing ───────────────────
  Mail, MessageCircle, MessageSquare, Phone, PhoneCall, Send,
  Mic, Headphones, Bell, Rss, Link2, ExternalLink, Hash, AtSign, Radio,
  // ── Legal, Rights & Social ──────────────────────
  Scale, Gavel, Landmark, BookOpen, Book, Heart, HeartPulse,
  Flag, Home, School, GraduationCap, Shield, ShieldCheck, Activity,
  HandHeart, Globe2 as Earth, TreePine, Leaf,
  // ── Operations & Management ─────────────────────
  Calendar, Clock, Timer, CheckCircle, ListTodo, Kanban, Filter,
  Archive, Download, Upload, Search as SearchIcon, Repeat, Workflow,
  FolderOpen, ClipboardSignature, BarChart,
} from 'lucide-react';

// ─── Curated icon catalogue ──────────────────────────────────────────────────

type IconEntry = { name: string; Icon: LucideIcon; tags: string };

const ALL_ICONS: IconEntry[] = [
  // Business & Consulting
  { name: 'Briefcase',        Icon: Briefcase,        tags: 'business work job office' },
  { name: 'Building',         Icon: Building,         tags: 'office company corporate' },
  { name: 'Building2',        Icon: Building2,        tags: 'office company hq' },
  { name: 'ClipboardList',    Icon: ClipboardList,    tags: 'list task checklist' },
  { name: 'ClipboardCheck',   Icon: ClipboardCheck,   tags: 'done completed approved' },
  { name: 'FileText',         Icon: FileText,         tags: 'document report file' },
  { name: 'Handshake',        Icon: Handshake,        tags: 'deal partner agreement' },
  { name: 'HeartHandshake',   Icon: HeartHandshake,   tags: 'care help partnership' },
  { name: 'BarChart2',        Icon: BarChart2,        tags: 'chart graph analytics' },
  { name: 'BarChart3',        Icon: BarChart3,        tags: 'chart analytics stats' },
  { name: 'BarChart',         Icon: BarChart,         tags: 'chart graph bar' },
  { name: 'LineChart',        Icon: LineChart,        tags: 'graph trend analytics' },
  { name: 'PieChart',         Icon: PieChart,         tags: 'pie chart analytics share' },
  { name: 'TrendingUp',       Icon: TrendingUp,       tags: 'growth increase trend' },
  { name: 'TrendingDown',     Icon: TrendingDown,     tags: 'decline decrease' },
  { name: 'Target',           Icon: Target,           tags: 'goal aim strategy' },
  { name: 'Award',            Icon: Award,            tags: 'prize achievement badge' },
  { name: 'Star',             Icon: Star,             tags: 'rating favourite best' },
  { name: 'Trophy',           Icon: Trophy,           tags: 'winner award achievement' },
  { name: 'Medal',            Icon: Medal,            tags: 'award achievement honour' },
  { name: 'Megaphone',        Icon: Megaphone,        tags: 'marketing campaign announce' },
  { name: 'Globe',            Icon: Globe,            tags: 'world international web' },
  { name: 'Globe2',           Icon: Globe2,           tags: 'world global earth' },
  { name: 'MapPin',           Icon: MapPin,           tags: 'location place address' },
  { name: 'Users',            Icon: Users,            tags: 'team people group' },
  { name: 'User',             Icon: User,             tags: 'person profile account' },
  { name: 'UserCheck',        Icon: UserCheck,        tags: 'verified approved member' },
  { name: 'UserPlus',         Icon: UserPlus,         tags: 'add member invite' },
  { name: 'Network',          Icon: Network,          tags: 'connection graph nodes' },
  { name: 'Lightbulb',        Icon: Lightbulb,        tags: 'idea innovation insight' },
  { name: 'BadgeCheck',       Icon: BadgeCheck,       tags: 'verified certified quality' },
  { name: 'ThumbsUp',         Icon: ThumbsUp,         tags: 'like approve positive' },
  // Finance
  { name: 'DollarSign',       Icon: DollarSign,       tags: 'money currency price cost' },
  { name: 'Coins',            Icon: Coins,            tags: 'money cash savings' },
  { name: 'CreditCard',       Icon: CreditCard,       tags: 'payment card finance' },
  { name: 'Banknote',         Icon: Banknote,         tags: 'cash money bill' },
  { name: 'Wallet',           Icon: Wallet,           tags: 'money payment finance' },
  { name: 'Receipt',          Icon: Receipt,          tags: 'invoice billing transaction' },
  { name: 'PiggyBank',        Icon: PiggyBank,        tags: 'savings fund finance' },
  // Tech & Engineering
  { name: 'Code',             Icon: Code,             tags: 'programming developer software' },
  { name: 'Code2',            Icon: Code2,            tags: 'programming dev engineering' },
  { name: 'Terminal',         Icon: Terminal,         tags: 'command line console dev' },
  { name: 'Server',           Icon: Server,           tags: 'hosting infrastructure backend' },
  { name: 'Database',         Icon: Database,         tags: 'data storage sql' },
  { name: 'Cloud',            Icon: Cloud,            tags: 'cloud hosting saas storage' },
  { name: 'HardDrive',        Icon: HardDrive,        tags: 'storage disk data' },
  { name: 'Cpu',              Icon: Cpu,              tags: 'processor hardware chip' },
  { name: 'Monitor',          Icon: Monitor,          tags: 'screen display desktop' },
  { name: 'Laptop',           Icon: Laptop,           tags: 'computer portable device' },
  { name: 'Smartphone',       Icon: Smartphone,       tags: 'mobile phone app' },
  { name: 'Wifi',             Icon: Wifi,             tags: 'internet wireless network' },
  { name: 'GitBranch',        Icon: GitBranch,        tags: 'version control git code' },
  { name: 'Layers',           Icon: Layers,           tags: 'stack architecture fullstack' },
  { name: 'LayoutGrid',       Icon: LayoutGrid,       tags: 'grid layout design' },
  { name: 'LayoutDashboard',  Icon: LayoutDashboard,  tags: 'dashboard ui panel' },
  { name: 'Wrench',           Icon: Wrench,           tags: 'tool fix maintenance' },
  { name: 'Package',          Icon: Package,          tags: 'product delivery module' },
  { name: 'Rocket',           Icon: Rocket,           tags: 'launch startup fast deploy' },
  { name: 'Zap',              Icon: Zap,              tags: 'fast speed automation' },
  { name: 'Bot',              Icon: Bot,              tags: 'ai robot automation' },
  { name: 'Brain',            Icon: Brain,            tags: 'ai intelligence thinking' },
  { name: 'Sparkles',         Icon: Sparkles,         tags: 'ai magic new feature' },
  { name: 'Blocks',           Icon: Blocks,           tags: 'modules components integration' },
  { name: 'Settings',         Icon: Settings,         tags: 'configuration setup manage' },
  { name: 'Settings2',        Icon: Settings2,        tags: 'configuration tuning adjust' },
  // Creative & Design
  { name: 'Pen',              Icon: Pen,              tags: 'write edit create design' },
  { name: 'Pencil',           Icon: Pencil,           tags: 'edit write draw design' },
  { name: 'PenTool',          Icon: PenTool,          tags: 'design vector path' },
  { name: 'Palette',          Icon: Palette,          tags: 'colour design art creative' },
  { name: 'Paintbrush',       Icon: Paintbrush,       tags: 'design art creative brand' },
  { name: 'Image',            Icon: Image,            tags: 'photo picture media' },
  { name: 'Camera',           Icon: Camera,           tags: 'photo photography media' },
  { name: 'Film',             Icon: Film,             tags: 'video media content' },
  { name: 'Video',            Icon: Video,            tags: 'video recording media' },
  // Communication & Marketing
  { name: 'Mail',             Icon: Mail,             tags: 'email contact message' },
  { name: 'MessageCircle',    Icon: MessageCircle,    tags: 'chat message support' },
  { name: 'MessageSquare',    Icon: MessageSquare,    tags: 'chat feedback comment' },
  { name: 'Phone',            Icon: Phone,            tags: 'call contact telephone' },
  { name: 'PhoneCall',        Icon: PhoneCall,        tags: 'call support telephone' },
  { name: 'Send',             Icon: Send,             tags: 'email send message outreach' },
  { name: 'Mic',              Icon: Mic,              tags: 'audio voice podcast record' },
  { name: 'Headphones',       Icon: Headphones,       tags: 'audio support listen' },
  { name: 'Bell',             Icon: Bell,             tags: 'alert notification remind' },
  { name: 'Rss',              Icon: Rss,              tags: 'feed blog content syndicate' },
  { name: 'Link2',            Icon: Link2,            tags: 'url link connect' },
  { name: 'ExternalLink',     Icon: ExternalLink,     tags: 'open link external url' },
  { name: 'Hash',             Icon: Hash,             tags: 'tag social media hashtag' },
  { name: 'AtSign',           Icon: AtSign,           tags: 'email mention social' },
  { name: 'Radio',            Icon: Radio,            tags: 'broadcast media signal' },
  // Legal, Rights & Social
  { name: 'Scale',            Icon: Scale,            tags: 'legal justice law balance' },
  { name: 'Gavel',            Icon: Gavel,            tags: 'law court judge legal' },
  { name: 'Landmark',         Icon: Landmark,         tags: 'government institution law' },
  { name: 'BookOpen',         Icon: BookOpen,         tags: 'education learning read' },
  { name: 'Book',             Icon: Book,             tags: 'knowledge education resource' },
  { name: 'Heart',            Icon: Heart,            tags: 'love care charity social' },
  { name: 'HeartPulse',       Icon: HeartPulse,       tags: 'health care wellness' },
  { name: 'HandHeart',        Icon: HandHeart,        tags: 'charity giving care ngo' },
  { name: 'Flag',             Icon: Flag,             tags: 'milestone goal nation' },
  { name: 'Home',             Icon: Home,             tags: 'house community local' },
  { name: 'School',           Icon: School,           tags: 'education learning institution' },
  { name: 'GraduationCap',    Icon: GraduationCap,    tags: 'education degree training' },
  { name: 'Shield',           Icon: Shield,           tags: 'protection security defence' },
  { name: 'ShieldCheck',      Icon: ShieldCheck,      tags: 'secure verified safe' },
  { name: 'Activity',         Icon: Activity,         tags: 'health monitoring action' },
  { name: 'TreePine',         Icon: TreePine,         tags: 'environment nature sustainability' },
  { name: 'Leaf',             Icon: Leaf,             tags: 'eco green nature environment' },
  // Operations & Management
  { name: 'Calendar',         Icon: Calendar,         tags: 'schedule date planning timeline' },
  { name: 'Clock',            Icon: Clock,            tags: 'time schedule deadline' },
  { name: 'Timer',            Icon: Timer,            tags: 'time tracking performance' },
  { name: 'CheckCircle',      Icon: CheckCircle,      tags: 'done complete success verify' },
  { name: 'ListTodo',         Icon: ListTodo,         tags: 'tasks todo checklist manage' },
  { name: 'Kanban',           Icon: Kanban,           tags: 'board agile project sprint' },
  { name: 'Filter',           Icon: Filter,           tags: 'sort filter organize' },
  { name: 'Archive',          Icon: Archive,          tags: 'store record history' },
  { name: 'Download',         Icon: Download,         tags: 'download export save' },
  { name: 'Upload',           Icon: Upload,           tags: 'upload import publish' },
  { name: 'Repeat',           Icon: Repeat,           tags: 'cycle recurring process' },
  { name: 'Workflow',         Icon: Workflow,         tags: 'process automation pipeline' },
  { name: 'FolderOpen',       Icon: FolderOpen,       tags: 'project files organise' },
];

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  value: string;
  onChange: (name: string) => void;
  fieldName?: string;
};

export default function IconPicker({ value, onChange, fieldName }: Props) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const inputRef              = useRef<HTMLInputElement>(null);

  const CurrentIcon = useMemo(
    () => ALL_ICONS.find(i => i.name === value)?.Icon ?? null,
    [value],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_ICONS;
    const q = query.toLowerCase();
    return ALL_ICONS.filter(
      i => i.name.toLowerCase().includes(q) || i.tags.includes(q),
    );
  }, [query]);

  function select(name: string) {
    onChange(name);
    setOpen(false);
    setQuery('');
  }

  // Auto-focus search when modal opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <>
      {/* Hidden input for form submission */}
      {fieldName && <input type="hidden" name={fieldName} value={value} />}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] rounded-lg text-sm text-white transition-all group"
      >
        {CurrentIcon ? (
          <CurrentIcon size={16} className="text-indigo-400 shrink-0" />
        ) : (
          <div className="w-4 h-4 rounded border border-dashed border-zinc-700 shrink-0" />
        )}
        <span className={`flex-1 text-left ${value ? 'text-white' : 'text-zinc-600'}`}>
          {value || 'Pick an icon…'}
        </span>
        <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            onClick={e => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg bg-[#111118] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
              <Search size={14} className="text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <X size={13} />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="p-1 text-zinc-600 hover:text-zinc-400 rounded-lg hover:bg-white/[0.05] transition-all ml-1">
                <X size={15} />
              </button>
            </div>

            {/* Count */}
            <p className="px-4 pt-2 pb-0 text-[10px] text-zinc-700">
              {filtered.length} icon{filtered.length !== 1 ? 's' : ''}
              {value && <span className="ml-2 text-indigo-400">Selected: {value}</span>}
            </p>

            {/* Icon grid */}
            <div className="overflow-y-auto p-3">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-zinc-600 py-10">No icons match "{query}"</p>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
                  {filtered.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => select(name)}
                      title={name}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                        value === name
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-[9px] leading-tight text-center truncate w-full">
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
