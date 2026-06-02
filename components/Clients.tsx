'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import type { Client } from '@prisma/client';

type Props = { clients: Client[] };

const COMPANY_FILTERS = ['All', 'Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'Technonix'];

const DEFAULT_CLIENTS: Client[] = [
  { id: '1',  name: 'Planet Education Network', logoUrl: null, website: null, company: 'Arbree',   order: 0 },
  { id: '2',  name: 'Sportigy',                 logoUrl: null, website: null, company: 'Arbree',   order: 1 },
  { id: '3',  name: 'ChargeAI',                 logoUrl: null, website: null, company: 'Arbree',   order: 2 },
  { id: '4',  name: 'UAE Customs',              logoUrl: null, website: null, company: 'Arbree',   order: 3 },
  { id: '5',  name: 'Munshi Group',             logoUrl: null, website: null, company: 'Arbree',   order: 4 },
  { id: '6',  name: 'Murfin Inc.',              logoUrl: null, website: null, company: 'Opus',     order: 0 },
  { id: '7',  name: 'Teletalk',                 logoUrl: null, website: null, company: 'Opus',     order: 1 },
  { id: '8',  name: 'Lanka Bangla Finance',     logoUrl: null, website: null, company: 'Opus',     order: 2 },
  { id: '9',  name: 'Pro-Edge Pundit',          logoUrl: null, website: null, company: 'Opus',     order: 3 },
  { id: '10', name: 'Belancer',                 logoUrl: null, website: null, company: 'HyperTag', order: 0 },
  { id: '11', name: 'Apple Soft IT',            logoUrl: null, website: null, company: 'HyperTag', order: 1 },
  { id: '12', name: 'Inkistry',                 logoUrl: null, website: null, company: 'Masleap',  order: 0 },
  { id: '13', name: 'HISA (USA)',               logoUrl: null, website: null, company: 'Masleap',  order: 1 },
  { id: '14', name: 'TripBeyond',               logoUrl: null, website: null, company: 'Masleap',  order: 2 },
];

function ClientCard({ client, index }: { client: Client; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.07] rounded-xl hover:border-indigo-500/20 transition-all duration-300 aspect-square min-h-[100px]"
    >
      {client.logoUrl ? (
        <div className="relative w-16 h-10">
          <Image src={client.logoUrl} alt={client.name} fill className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-indigo-500/[0.07] border border-indigo-500/15 flex items-center justify-center mb-2">
          <span className="text-indigo-400 text-sm font-bold">{client.name[0]}</span>
        </div>
      )}
      <p className="text-[11px] text-zinc-600 group-hover:text-zinc-300 transition-colors text-center mt-2 leading-tight">
        {client.name}
      </p>
    </motion.div>
  );
}

export default function Clients({ clients }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const display = clients.length ? clients : DEFAULT_CLIENTS;
  const filtered = activeFilter === 'All' ? display : display.filter((c) => c.company === activeFilter);
  const usedCompanies = ['All', ...Array.from(new Set(display.map((c) => c.company)))];

  return (
    <section id="clients" className="py-20 px-6 bg-[#0d0d10]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">06</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Awesome Clients</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Clients &amp; Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-[14px] mb-7"
          >
            Filter by the company context in which each relationship was managed.
          </motion.p>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {COMPANY_FILTERS.filter((f) => usedCompanies.includes(f)).map((f) => (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileTap={{ scale: 0.95 }}
                className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider rounded-full border transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                    : 'text-zinc-600 border-white/[0.07] hover:text-zinc-300 hover:border-white/15'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-700 py-16 text-sm">No clients for this company yet.</p>
        )}
      </div>
    </section>
  );
}
