import { prisma } from '@/lib/prisma';
import InboxManager from './InboxManager';

export default async function InboxPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const data = messages.map(m => ({
    id:            m.id,
    name:          m.name,
    phone:         m.phone,
    email:         m.email,
    subject:       m.subject,
    message:       m.message,
    attachmentUrl: m.attachmentUrl,
    isRead:        m.isRead,
    createdAt:     m.createdAt.toISOString(),
  }));

  const unread = data.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-white">Inbox</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-xs font-bold">
              {unread} new
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500">
          All contact form submissions. Click a message to read it — it auto-marks as read.
        </p>
      </div>
      <InboxManager initialMessages={data} />
    </div>
  );
}
