'use client';

import { useState, useTransition } from 'react';
import { markMessageRead, deleteMessage } from '@/app/actions/contact';
import {
  Mail, MailOpen, Trash2, Loader2, Phone, AtSign,
  Paperclip, ChevronDown, ChevronUp, Clock,
} from 'lucide-react';

type Message = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function MessageRow({ msg, onDeleted }: { msg: Message; onDeleted: () => void }) {
  const [open, setOpen]         = useState(false);
  const [isRead, setIsRead]     = useState(msg.isRead);
  const [isPending, startTrans] = useTransition();

  function toggle() {
    const next = !open;
    setOpen(next);
    // Auto-mark as read when first opened
    if (next && !isRead) {
      const fd = new FormData();
      fd.append('id', msg.id);
      fd.append('isRead', 'true');
      startTrans(async () => {
        await markMessageRead(fd);
        setIsRead(true);
      });
    }
  }

  function handleToggleRead(e: React.MouseEvent) {
    e.stopPropagation();
    const fd = new FormData();
    fd.append('id', msg.id);
    fd.append('isRead', String(!isRead));
    startTrans(async () => {
      await markMessageRead(fd);
      setIsRead(v => !v);
    });
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete message from "${msg.name}"?`)) return;
    const fd = new FormData();
    fd.append('id', msg.id);
    startTrans(async () => {
      await deleteMessage(fd);
      onDeleted();
    });
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${
      isRead ? 'border-white/[0.07] bg-white/[0.015]' : 'border-indigo-500/25 bg-indigo-500/[0.03]'
    }`}>
      {/* Summary row — always visible */}
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="shrink-0 mt-0.5">
          {isRead
            ? <MailOpen size={15} className="text-zinc-600" />
            : <Mail     size={15} className="text-indigo-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold truncate ${isRead ? 'text-zinc-300' : 'text-white'}`}>
              {msg.name}
            </span>
            {!isRead && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 shrink-0">
                New
              </span>
            )}
          </div>

          {msg.subject && (
            <p className="text-xs text-zinc-400 truncate mt-0.5">{msg.subject}</p>
          )}

          <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600 flex-wrap">
            {msg.email && (
              <span className="flex items-center gap-1"><AtSign size={9} />{msg.email}</span>
            )}
            {msg.phone && (
              <span className="flex items-center gap-1"><Phone size={9} />{msg.phone}</span>
            )}
            <span className="flex items-center gap-1"><Clock size={9} />{formatDate(msg.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Mark read/unread toggle */}
          <span
            onClick={handleToggleRead}
            role="button"
            title={isRead ? 'Mark as unread' : 'Mark as read'}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isRead
                ? 'text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.05]'
                : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.08]'
            }`}
          >
            {isRead ? <Mail size={13} /> : <MailOpen size={13} />}
          </span>

          <span
            onClick={handleDelete}
            role="button"
            title="Delete"
            className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/[0.06] transition-all cursor-pointer disabled:opacity-40"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </span>

          {open ? <ChevronUp size={14} className="text-zinc-600" /> : <ChevronDown size={14} className="text-zinc-600" />}
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
          {msg.message && (
            <div className="bg-white/[0.025] rounded-xl px-4 py-3">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Message</p>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          )}

          {msg.attachmentUrl && (
            <div className="flex items-center gap-2">
              <Paperclip size={12} className="text-indigo-400 shrink-0" />
              <a
                href={msg.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 truncate"
              >
                {msg.attachmentUrl.split('/').pop() ?? 'View attachment'}
              </a>
            </div>
          )}

          {/* Quick-reply links */}
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            {msg.email && (
              <a
                href={`mailto:${msg.email}${msg.subject ? `?subject=Re: ${encodeURIComponent(msg.subject)}` : ''}`}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <AtSign size={11} /> Reply by email
              </a>
            )}
            {msg.phone && (
              <a
                href={`tel:${msg.phone}`}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <Phone size={11} /> Call
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InboxManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="max-w-3xl">
      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-6 text-xs">
        <span className="text-indigo-400 font-semibold">{unread} unread</span>
        <span className="text-zinc-700">·</span>
        <span className="text-zinc-500">{messages.length} total</span>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MailOpen size={36} className="text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-600">No messages yet. Contact form submissions appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <MessageRow
              key={msg.id}
              msg={msg}
              onDeleted={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
