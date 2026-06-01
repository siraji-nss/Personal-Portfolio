import { prisma } from '@/lib/prisma';
import AboutForm, { type BentoCardData } from './AboutForm';

export default async function AboutAdminPage() {
  const about = await prisma.aboutConfig.findUnique({ where: { id: 'main' } });

  const defaultCards: Record<string, BentoCardData> = {};
  if (Array.isArray(about?.cards)) {
    for (const c of about.cards as BentoCardData[]) {
      if (c?.id) defaultCards[c.id] = c;
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">About Section</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Edit the bio, headline, CV link, and all four expertise bento card details.
      </p>
      <AboutForm
        defaultHeadline={about?.headline ?? 'Bridging technology and strategy'}
        defaultBio={about?.bio ?? ''}
        defaultCvUrl={about?.cvUrl ?? ''}
        defaultCards={defaultCards}
      />
    </div>
  );
}
