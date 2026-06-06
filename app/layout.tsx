import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Providers from '@/components/providers';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

async function buildMetadata(): Promise<Metadata> {
  const hero = await prisma.heroConfig.findUnique({
    where: { id: 'main' },
    select: { faviconUrl: true, siteTitle: true, fullName: true },
  });
  const title = hero?.siteTitle?.trim() ||
    `${hero?.fullName ?? 'Nazmus Sakib Siraji'} — Software Engineer & Technical PM`;
  return {
    title,
    description:
      'Portfolio of Nazmus Sakib Siraji — Software Engineer, Technical Project Manager, and Founder of Technonix.',
    openGraph: {
      title: hero?.fullName ?? 'Nazmus Sakib Siraji',
      description: 'Software Engineer · Technical PM · Entrepreneur',
      type: 'website',
    },
    themeColor: '#09090b',
    icons: { icon: hero?.faviconUrl ?? '/favicon.ico' },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, hero] = await Promise.all([
    getServerSession(authOptions),
    prisma.heroConfig.findUnique({ where: { id: 'main' }, select: { whatsappNumber: true } }),
  ]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#09090b] text-zinc-50 antialiased">
        <Providers session={session}>{children}</Providers>
        {hero?.whatsappNumber && <WhatsAppButton number={hero.whatsappNumber} />}
        <Analytics />
      </body>
    </html>
  );
}
