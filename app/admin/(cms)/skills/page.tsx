import { prisma } from '@/lib/prisma';
import SkillsManager from './SkillsManager';

const DEFAULT_CATEGORIES = [
  { name: 'Software Engineering',   slug: 'tech',       color: 'indigo',  order: 0 },
  { name: 'Project Management',     slug: 'pm',         color: 'violet',  order: 1 },
  { name: 'Business Consultancy',   slug: 'consulting', color: 'emerald', order: 2 },
  { name: 'Human Rights Advocacy',  slug: 'advocacy',   color: 'rose',    order: 3 },
];

export default async function SkillsAdminPage() {
  // Auto-seed the 4 default categories on first visit if none exist
  let categories = await prisma.skillCategory.findMany({ orderBy: { order: 'asc' } });
  if (categories.length === 0) {
    await prisma.skillCategory.createMany({ data: DEFAULT_CATEGORIES, skipDuplicates: true });
    categories = await prisma.skillCategory.findMany({ orderBy: { order: 'asc' } });
  }

  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Skills</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Manage categories and skills. Categories control the columns shown on the public site.
        Hover any skill row to edit or delete it. Set the order number to control sort position within a category.
      </p>
      <SkillsManager
        initialCategories={categories}
        initialSkills={skills}
      />
    </div>
  );
}
