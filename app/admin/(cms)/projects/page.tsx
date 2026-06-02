import { prisma } from '@/lib/prisma';
import ProjectsManager from './ProjectsManager';

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }] });

  const data = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    company: p.company,
    tags: p.tags,
    featured: p.featured,
    order: p.order,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Projects</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Portfolio items. The <code className="text-indigo-400">company</code> field drives the filter bar on the site.
        Click <span className="text-indigo-400">Edit</span> on any project to update it.
      </p>
      <ProjectsManager initialProjects={data} />
    </div>
  );
}
