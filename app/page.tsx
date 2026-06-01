import { prisma } from '@/lib/prisma';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Services from '@/components/Services';
import Resume from '@/components/Resume';
import Portfolio from '@/components/Portfolio';
import Clients from '@/components/Clients';
import FeaturedGallery from '@/components/FeaturedGallery';
import FeaturedBlogs from '@/components/FeaturedBlogs';
import Footer from '@/components/Footer';

async function getData() {
  const [
    heroConfig,
    aboutConfig,
    skills,
    services,
    experiences,
    education,
    projects,
    clients,
    stats,
    trainings,
    featuredBlogs,
    featuredGallery,
    footerConfig,
  ] = await Promise.all([
    prisma.heroConfig.findUnique({ where: { id: 'main' } }),
    prisma.aboutConfig.findUnique({ where: { id: 'main' } }),
    prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.education.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }] }),
    prisma.client.findMany({ orderBy: [{ company: 'asc' }, { order: 'asc' }] }),
    prisma.stat.findMany({ orderBy: { order: 'asc' } }),
    prisma.training.findMany({ orderBy: { order: 'asc' } }),
    prisma.blogPost.findMany({
      where: { featured: true, published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { category: true },
    }),
    prisma.galleryPost.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.footerConfig.findUnique({ where: { id: 'main' } }),
  ]);

  return {
    heroConfig, aboutConfig, skills, services, experiences, education,
    projects, clients, stats, trainings, featuredBlogs, featuredGallery, footerConfig,
  };
}

export default async function HomePage() {
  const {
    heroConfig, aboutConfig, skills, services, experiences, education,
    projects, clients, stats, trainings, featuredBlogs, featuredGallery, footerConfig,
  } = await getData();

  return (
    <>
      <Navigation
        fullName={heroConfig?.fullName ?? 'Nazmus Sakib Siraji'}
        avatarUrl={heroConfig?.avatarUrl}
      />
      <main>
        <Hero heroConfig={heroConfig} />
        <About about={aboutConfig} stats={stats} />
        <Skills skills={skills} />
        <Services services={services} />
        <Resume experiences={experiences} education={education} trainings={trainings} />
        <Portfolio projects={projects} />
        <Clients clients={clients} />
        <FeaturedGallery posts={featuredGallery} />
        <FeaturedBlogs posts={featuredBlogs} />
      </main>
      <Footer footerConfig={footerConfig} heroConfig={heroConfig} />
    </>
  );
}
