'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// SVG Illustrations
// ─────────────────────────────────────────────────────────────────

function EngineeringIllustration() {
  return (
    <svg viewBox="0 0 160 110" className="w-full max-w-[180px]" fill="none">
      <defs>
        <linearGradient id="ei-g1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#818cf8" /><stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <filter id="ei-glow"><feGaussianBlur stdDeviation="2.5" result="b" /><feComposite in="SourceGraphic" in2="b" operator="over" /></filter>
      </defs>
      {/* Grid lines background */}
      {[20,40,60,80,100,120,140].map(x => <line key={x} x1={x} y1="0" x2={x} y2="110" stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />)}
      {[15,30,45,60,75,90,105].map(y => <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />)}
      {/* Connection lines */}
      <line x1="30" y1="55" x2="72" y2="28" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55" />
      <line x1="30" y1="55" x2="72" y2="82" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55" />
      <line x1="88" y1="28" x2="130" y2="55" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55" />
      <line x1="88" y1="82" x2="130" y2="55" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55" />
      <line x1="72" y1="28" x2="88" y2="28" stroke="#6366f1" strokeWidth="1.2" opacity="0.35" />
      <line x1="72" y1="82" x2="88" y2="82" stroke="#6366f1" strokeWidth="1.2" opacity="0.35" />
      {/* Outer nodes */}
      <circle cx="30" cy="55" r="9" fill="#0f0f18" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="30" cy="55" r="5" fill="url(#ei-g1)" filter="url(#ei-glow)" />
      <circle cx="130" cy="55" r="9" fill="#0f0f18" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="130" cy="55" r="5" fill="url(#ei-g1)" filter="url(#ei-glow)" />
      {/* Inner nodes */}
      <circle cx="80" cy="28" r="7" fill="#0f0f18" stroke="#818cf8" strokeWidth="1.5" />
      <circle cx="80" cy="28" r="3.5" fill="#818cf8" opacity="0.85" />
      <circle cx="80" cy="82" r="7" fill="#0f0f18" stroke="#818cf8" strokeWidth="1.5" />
      <circle cx="80" cy="82" r="3.5" fill="#818cf8" opacity="0.85" />
      {/* Center processor box */}
      <rect x="62" y="37" width="36" height="36" rx="6" fill="#0f0f18" stroke="#6366f1" strokeWidth="1.5" />
      <rect x="66" y="41" width="28" height="28" rx="4" fill="#6366f1" opacity="0.12" />
      {/* Code text */}
      <text x="68" y="60" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="bold">{'</>'}</text>
      {/* Satellite dots */}
      <circle cx="12" cy="30" r="3" fill="#6366f1" opacity="0.4" />
      <circle cx="148" cy="30" r="3" fill="#6366f1" opacity="0.4" />
      <circle cx="12" cy="80" r="3" fill="#6366f1" opacity="0.4" />
      <circle cx="148" cy="80" r="3" fill="#6366f1" opacity="0.4" />
    </svg>
  );
}

function PMIllustration() {
  return (
    <svg viewBox="0 0 160 110" className="w-full max-w-[180px]" fill="none">
      <defs>
        <linearGradient id="pm-g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#60a5fa" /><stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="pm-g2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#93c5fd" stopOpacity="0.6" /><stop offset="1" stopColor="#60a5fa" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Column backgrounds */}
      <rect x="8"  y="14" width="42" height="88" rx="5" fill="#1a1a2e" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
      <rect x="59" y="14" width="42" height="88" rx="5" fill="#1a1a2e" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
      <rect x="110" y="14" width="42" height="88" rx="5" fill="#1a1a2e" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
      {/* Column headers */}
      <rect x="8"  y="14" width="42" height="14" rx="5" fill="#3b82f6" opacity="0.25" />
      <rect x="59" y="14" width="42" height="14" rx="5" fill="#3b82f6" opacity="0.25" />
      <rect x="110" y="14" width="42" height="14" rx="5" fill="#3b82f6" opacity="0.25" />
      <text x="16" y="24" fill="#93c5fd" fontSize="5.5" fontFamily="sans-serif" fontWeight="600">TODO</text>
      <text x="65" y="24" fill="#93c5fd" fontSize="5.5" fontFamily="sans-serif" fontWeight="600">IN PROGRESS</text>
      <text x="118" y="24" fill="#93c5fd" fontSize="5.5" fontFamily="sans-serif" fontWeight="600">DONE</text>
      {/* Cards col 1 */}
      <rect x="13" y="33" width="32" height="13" rx="3" fill="url(#pm-g1)" opacity="0.75" />
      <rect x="13" y="50" width="32" height="13" rx="3" fill="url(#pm-g2)" />
      <rect x="13" y="67" width="32" height="13" rx="3" fill="url(#pm-g2)" opacity="0.6" />
      {/* Cards col 2 */}
      <rect x="64" y="33" width="32" height="13" rx="3" fill="url(#pm-g1)" opacity="0.75" />
      <rect x="64" y="50" width="32" height="13" rx="3" fill="url(#pm-g1)" opacity="0.5" />
      {/* Cards col 3 */}
      <rect x="115" y="33" width="32" height="13" rx="3" fill="url(#pm-g1)" opacity="0.75" />
      {/* Progress dots on cards */}
      <circle cx="19" cy="39.5" r="2" fill="#bfdbfe" opacity="0.8" />
      <circle cx="25" cy="39.5" r="2" fill="#bfdbfe" opacity="0.5" />
      <circle cx="31" cy="39.5" r="2" fill="#bfdbfe" opacity="0.3" />
      <circle cx="70" cy="39.5" r="2" fill="#bfdbfe" opacity="0.8" />
      <circle cx="76" cy="39.5" r="2" fill="#bfdbfe" opacity="0.8" />
      <circle cx="82" cy="39.5" r="2" fill="#bfdbfe" opacity="0.4" />
      <circle cx="121" cy="39.5" r="2" fill="#bfdbfe" opacity="0.9" />
      <circle cx="127" cy="39.5" r="2" fill="#bfdbfe" opacity="0.9" />
      <circle cx="133" cy="39.5" r="2" fill="#bfdbfe" opacity="0.9" />
      {/* Timeline bar at bottom */}
      <rect x="8" y="107" width="144" height="3" rx="1.5" fill="#1e3a5f" />
      <rect x="8" y="107" width="96" height="3" rx="1.5" fill="#3b82f6" opacity="0.7" />
      <circle cx="104" cy="108.5" r="3.5" fill="#60a5fa" />
    </svg>
  );
}

function ConsultingIllustration() {
  return (
    <svg viewBox="0 0 160 110" className="w-full max-w-[180px]" fill="none">
      <defs>
        <linearGradient id="ci-g1" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#10b981" stopOpacity="0.2" /><stop offset="1" stopColor="#10b981" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="ci-g2" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#10b981" /><stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* Axes */}
      <line x1="22" y1="90" x2="152" y2="90" stroke="#374151" strokeWidth="1" />
      <line x1="22" y1="90" x2="22" y2="10" stroke="#374151" strokeWidth="1" />
      {/* Y-axis ticks */}
      {[20,40,60,80].map((y,i) => (
        <g key={y}>
          <line x1="18" y1={y} x2="22" y2={y} stroke="#374151" strokeWidth="0.8" />
          <text x="4" y={y+3} fill="#4b5563" fontSize="5" fontFamily="sans-serif">{(4-i)*25}</text>
        </g>
      ))}
      {/* Bars */}
      {[
        { x: 32, h: 28, y: 62 },
        { x: 58, h: 40, y: 50 },
        { x: 84, h: 52, y: 38 },
        { x: 110, h: 68, y: 22 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width="20" height={b.h} rx="3" fill="url(#ci-g1)" />
          <rect x={b.x} y={b.y} width="20" height="4" rx="2" fill="url(#ci-g2)" opacity="0.9" />
        </g>
      ))}
      {/* Trend line */}
      <polyline points="42,60 68,47 94,36 120,18"
        stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {[[42,60],[68,47],[94,36],[120,18]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#0f0f18" stroke="#10b981" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="2" fill="#34d399" />
        </g>
      ))}
      {/* Arrow + % badge */}
      <rect x="128" y="10" width="24" height="14" rx="4" fill="#064e3b" />
      <text x="130" y="20" fill="#34d399" fontSize="7" fontFamily="sans-serif" fontWeight="bold">+124%</text>
      {/* Network nodes top right */}
      <circle cx="145" cy="50" r="4" fill="#0f0f18" stroke="#10b981" strokeWidth="1" opacity="0.7" />
      <circle cx="152" cy="62" r="3" fill="#10b981" opacity="0.5" />
      <circle cx="138" cy="62" r="3" fill="#10b981" opacity="0.5" />
      <line x1="145" y1="54" x2="152" y2="59" stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
      <line x1="145" y1="54" x2="138" y2="59" stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function SocialIllustration() {
  const nodes = [
    { cx: 80, cy: 16 }, { cx: 122, cy: 38 }, { cx: 122, cy: 76 },
    { cx: 80, cy: 98 }, { cx: 38, cy: 76  }, { cx: 38, cy: 38  },
  ];
  return (
    <svg viewBox="0 0 160 114" className="w-full max-w-[180px]" fill="none">
      <defs>
        <linearGradient id="si-g1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fb7185" /><stop offset="1" stopColor="#f43f5e" />
        </linearGradient>
        <radialGradient id="si-center" cx="50%" cy="50%" r="50%">
          <stop stopColor="#f43f5e" stopOpacity="0.3" /><stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="80" cy="57" r="50" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.2" />
      {/* Spokes to center */}
      {nodes.map((n, i) => (
        <line key={i} x1={n.cx} y1={n.cy} x2="80" y2="57"
          stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
      ))}
      {/* Center glow */}
      <circle cx="80" cy="57" r="22" fill="url(#si-center)" />
      <circle cx="80" cy="57" r="12" fill="#0f0f18" stroke="#f43f5e" strokeWidth="1.5" />
      <circle cx="80" cy="57" r="6" fill="url(#si-g1)" />
      {/* Outer nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="9" fill="#0f0f18" stroke="#f43f5e" strokeWidth="1.5" />
          {/* Person silhouette */}
          <circle cx={n.cx} cy={n.cy - 2.5} r="2.5" fill="#fb7185" opacity="0.8" />
          <path d={`M${n.cx - 4} ${n.cy + 6} Q${n.cx} ${n.cy + 2} ${n.cx + 4} ${n.cy + 6}`}
            stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </g>
      ))}
      {/* Small floating dots */}
      {[[14,20],[146,20],[14,94],[146,94]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#f43f5e" opacity="0.3" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Expanded content panels
// ─────────────────────────────────────────────────────────────────

function Badge({ children, color = 'indigo' }: { children: React.ReactNode; color?: string }) {
  const map: Record<string, string> = {
    indigo:  'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    blue:    'bg-blue-500/15   text-blue-300   border-blue-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    rose:    'bg-rose-500/15   text-rose-300   border-rose-500/30',
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${map[color] ?? map.indigo}`}>
      {children}
    </span>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-zinc-400 leading-relaxed">
      <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0 opacity-60" />
      {children}
    </li>
  );
}

function EngineeringExpanded() {
  const stack = [
    { name: 'Next.js',      color: 'bg-white/10' },
    { name: 'Node.js',      color: 'bg-green-500/15' },
    { name: 'PostgreSQL',   color: 'bg-blue-500/15' },
    { name: 'MongoDB',      color: 'bg-emerald-500/15' },
    { name: 'WordPress',    color: 'bg-blue-400/15' },
    { name: 'Figma',        color: 'bg-violet-500/15' },
    { name: 'Digital Ocean', color: 'bg-blue-600/15' },
  ];
  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scroll">
      <p className="text-[13px] text-zinc-400 leading-relaxed">
        I architect and build end-to-end systems that are scalable, maintainable, and performant —
        from database schema design through server-side APIs to pixel-perfect frontends.
      </p>
      <ul className="space-y-2">
        <Bullet>Full-stack web & mobile application development across fintech, edtech, and healthtech domains</Bullet>
        <Bullet>RESTful & GraphQL API design, microservices architecture, and cloud deployment pipelines</Bullet>
        <Bullet>Server management & optimised deployment via Digital Ocean with CI/CD workflows</Bullet>
        <Bullet>UI/UX design in Figma bridging design systems to production code</Bullet>
      </ul>
      <div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2 font-semibold">Core Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {stack.map(t => (
            <span key={t.name} className={`${t.color} text-zinc-200 text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.07] font-medium`}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PMExpanded() {
  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scroll">
      <p className="text-[13px] text-zinc-400 leading-relaxed">
        I orchestrate complex software lifecycles across multi-disciplinary teams — translating
        business vision into structured, on-time deliveries without sacrificing quality.
      </p>
      <ul className="space-y-2">
        <Bullet>Led cross-functional teams of engineers, designers, and stakeholders across concurrent product lines</Bullet>
        <Bullet>Conduct rigorous <span className="text-blue-300 font-medium">User Acceptance Testing (UAT)</span> sessions to validate requirements before go-live</Bullet>
        <Bullet>Analyse and deconstruct <span className="text-blue-300 font-medium">Product Requirement Documents (PRDs)</span> to define sprint-ready tickets</Bullet>
        <Bullet>Track strict delivery milestones using Agile/Scrum methodologies with data-driven reporting</Bullet>
        <Bullet>Risk management, dependency mapping, and escalation frameworks for enterprise-grade projects</Bullet>
      </ul>
      <div className="flex flex-wrap gap-2">
        {['Agile / Scrum','UAT Management','PRD Analysis','Milestone Tracking','Stakeholder Comms'].map(t => (
          <Badge key={t} color="blue">{t}</Badge>
        ))}
      </div>
    </div>
  );
}

function ConsultingExpanded() {
  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scroll">
      <p className="text-[13px] text-zinc-400 leading-relaxed">
        I bridge the gap between business ambition and technical execution — helping organisations
        identify the right systems, enter new markets, and grow their digital presence strategically.
      </p>
      <ul className="space-y-2">
        <Bullet>Technology selection & system research tailored to global market-entry requirements</Bullet>
        <Bullet>Brand identity development, digital marketing strategies, and SEO-driven growth campaigns</Bullet>
        <Bullet>Full-funnel digital marketing: social media, content, paid campaigns, and analytics</Bullet>
        <Bullet>IT consultation for SMEs looking to modernise infrastructure and workflows</Bullet>
        <Bullet>Evaluation of build-vs-buy tradeoffs and vendor selection for technical solutions</Bullet>
      </ul>
      <div className="flex flex-wrap gap-2">
        {['Brand Strategy','Digital Marketing','SEO / Growth','Market Research','IT Consulting'].map(t => (
          <Badge key={t} color="emerald">{t}</Badge>
        ))}
      </div>
    </div>
  );
}

function SocialExpanded() {
  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scroll">
      <p className="text-[13px] text-zinc-400 leading-relaxed">
        Technology is only as valuable as its impact on human lives. I actively serve in
        organisations dedicated to human rights, justice, and societal development.
      </p>
      <ul className="space-y-2">
        <Bullet>
          <span className="text-rose-300 font-medium">Joint Secretary (Observation)</span> at the{' '}
          Bangladesh Human Rights Enforcement Foundation (BHREF) — monitoring violations, supporting
          advocacy campaigns, and coordinating legal aid initiatives
        </Bullet>
        <Bullet>
          <span className="text-rose-300 font-medium">Governing Body Member</span> at the{' '}
          Bangladesh Society Development Foundation (BSDF) — shaping policy and community
          development programmes across underserved regions
        </Bullet>
        <Bullet>Leveraging technology to amplify human rights reporting, data collection, and awareness</Bullet>
        <Bullet>Mentoring youth entrepreneurs in under-resourced communities through tech literacy programmes</Bullet>
      </ul>
      <div className="flex flex-wrap gap-2">
        {['BHREF','BSDF','Human Rights','Advocacy','Community Dev'].map(t => (
          <Badge key={t} color="rose">{t}</Badge>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Dynamic expanded panel — renders DB content when saved
// ─────────────────────────────────────────────────────────────────

function DynamicExpanded({ description, bullets, tags, color }: {
  description: string; bullets: string[]; tags: string[]; color: string;
}) {
  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1">
      {description && (
        <p className="text-[13px] text-zinc-400 leading-relaxed">{description}</p>
      )}
      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b, i) => <Bullet key={i}>{b}</Bullet>)}
        </ul>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => <Badge key={t} color={color}>{t}</Badge>)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Card definitions
// ─────────────────────────────────────────────────────────────────

const CARDS = [
  {
    id:            'engineering',
    title:         'Software Engineering',
    titleLine2:    '& Architecture',
    badge:         '10+ Years',
    accent:        'text-indigo-400',
    border:        'border-indigo-500/25',
    glow:          'hover:shadow-[0_0_28px_rgba(99,102,241,0.2)]',
    gradientFrom:  'from-indigo-900/40',
    gradientTo:    'to-violet-900/20',
    iconBg:        'from-indigo-500 to-violet-600',
    Illustration:  EngineeringIllustration,
    Expanded:      EngineeringExpanded,
  },
  {
    id:            'pm',
    title:         'Technical Project',
    titleLine2:    'Management',
    badge:         'Expert Level',
    accent:        'text-blue-400',
    border:        'border-blue-500/25',
    glow:          'hover:shadow-[0_0_28px_rgba(59,130,246,0.2)]',
    gradientFrom:  'from-blue-900/40',
    gradientTo:    'to-cyan-900/20',
    iconBg:        'from-blue-500 to-cyan-500',
    Illustration:  PMIllustration,
    Expanded:      PMExpanded,
  },
  {
    id:            'consulting',
    title:         'Tech Consulting &',
    titleLine2:    'Digital Marketing',
    badge:         'Global Reach',
    accent:        'text-emerald-400',
    border:        'border-emerald-500/25',
    glow:          'hover:shadow-[0_0_28px_rgba(16,185,129,0.2)]',
    gradientFrom:  'from-emerald-900/40',
    gradientTo:    'to-teal-900/20',
    iconBg:        'from-emerald-500 to-teal-500',
    Illustration:  ConsultingIllustration,
    Expanded:      ConsultingExpanded,
  },
  {
    id:            'social',
    title:         'Social Impact &',
    titleLine2:    'Human Rights',
    badge:         'Active Roles',
    accent:        'text-rose-400',
    border:        'border-rose-500/25',
    glow:          'hover:shadow-[0_0_28px_rgba(244,63,94,0.2)]',
    gradientFrom:  'from-rose-900/40',
    gradientTo:    'to-pink-900/20',
    iconBg:        'from-rose-500 to-pink-500',
    Illustration:  SocialIllustration,
    Expanded:      SocialExpanded,
  },
] as const;

type CardId = typeof CARDS[number]['id'];

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────

type CardOverride = { id: string; badge?: string; description?: string; bullets?: string; tags?: string };

export default function BentoAbout({
  cvUrl,
  cardOverrides = {},
}: {
  cvUrl?: string | null;
  cardOverrides?: Record<string, CardOverride>;
}) {
  const [selectedId, setSelectedId] = useState<CardId | null>(null);

  // Merge DB overrides into card definitions
  const cards = CARDS.map(c => {
    const ov = cardOverrides[c.id];
    return { ...c, badge: ov?.badge?.trim() || c.badge };
  });
  const selected   = cards.find(c => c.id === selectedId) ?? null;
  const otherCards = cards.filter(c => c.id !== selectedId);

  return (
    <div className="space-y-4">
      {/* Download CV */}
      {cvUrl && (
        <motion.a
          href={cvUrl} target="_blank" rel="noopener noreferrer"
          whileHover={{ y: -2, boxShadow: '0 0 32px rgba(99,102,241,0.35)' }}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200"
        >
          <Download size={15} /> Download CV
        </motion.a>
      )}

      {/* Bento grid container */}
      <div className="relative flex gap-3" style={{ minHeight: '460px' }}>

        {/* Sidebar — non-selected cards when expanded */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 68, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2.5 shrink-0 overflow-hidden"
            >
              {otherCards.map(card => (
                <motion.button
                  key={card.id}
                  layoutId={`tab-${card.id}`}
                  onClick={() => setSelectedId(card.id)}
                  title={`${card.title} ${card.titleLine2}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 rounded-xl bg-[#13131a] border ${card.border} flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-200 group hover:bg-white/[0.04] cursor-pointer`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <card.Illustration />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="flex-1 relative min-w-0">
          <AnimatePresence mode="wait">
            {!selected ? (
              /* ── Grid view ── */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="grid grid-cols-2 gap-3 absolute inset-0"
              >
                {cards.map((card, i) => (
                  <motion.button
                    key={card.id}
                    layoutId={`bento-${card.id}`}
                    onClick={() => setSelectedId(card.id)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-2xl bg-[#13131a] border ${card.border} flex flex-col p-5 cursor-pointer text-left group transition-all duration-300 ${card.glow}`}
                  >
                    {/* Gradient background tint */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    {/* Illustration */}
                    <div className="relative flex-1 flex items-center justify-center mb-3 min-h-0">
                      <card.Illustration />
                    </div>
                    {/* Text */}
                    <div className="relative">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${card.accent} mb-1 block`}>
                        {card.badge}
                      </span>
                      <h3 className="text-white font-bold text-[13px] leading-snug">
                        {card.title}<br />{card.titleLine2}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              /* ── Expanded view ── */
              <motion.div
                key={`expanded-${selectedId}`}
                layoutId={`bento-${selectedId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className={`absolute inset-0 rounded-2xl bg-[#13131a] border ${selected.border} overflow-hidden flex flex-col`}
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }}
              >
                {/* Card header */}
                <div className={`flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.05] bg-gradient-to-r ${selected.gradientFrom} ${selected.gradientTo}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selected.iconBg} flex items-center justify-center shrink-0 shadow-lg`}>
                      <selected.Illustration />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${selected.accent} block mb-0.5`}>
                        {selected.badge}
                      </span>
                      <h3 className="text-white font-bold text-sm leading-tight">
                        {selected.title} {selected.titleLine2}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-0.5 p-1 rounded-lg hover:bg-white/[0.06]"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Expanded body — DB content if saved, else hardcoded default */}
                <div className="px-5 py-4 flex flex-col flex-1 min-h-0">
                  {(() => {
                    const ov = cardOverrides[selected.id];
                    const dbBullets = ov?.bullets?.split('\n').map(s => s.trim()).filter(Boolean) ?? [];
                    const dbTags    = ov?.tags?.split('\n').map(s => s.trim()).filter(Boolean) ?? [];
                    const hasDbContent = ov?.description?.trim() || dbBullets.length || dbTags.length;
                    return hasDbContent ? (
                      <DynamicExpanded
                        description={ov?.description?.trim() ?? ''}
                        bullets={dbBullets}
                        tags={dbTags}
                        color={selected.iconBg.split(' ')[0].replace('from-', '').split('-')[0]}
                      />
                    ) : (
                      <selected.Expanded />
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
