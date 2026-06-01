import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ────────────────────────────────────────────────────────────
  const adminEmail    = process.env.ADMIN_EMAIL    ?? 'nazmussakibsiraji@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '123456';
  const hashed = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where:  { email: adminEmail },
    update: { password: hashed },
    create: { email: adminEmail, name: 'Nazmus Sakib Siraji', password: hashed, role: 'admin' },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // ── Hero Config ───────────────────────────────────────────────────────────
  await prisma.heroConfig.upsert({
    where:  { id: 'main' },
    update: {},
    create: {
      id: 'main',
      typingTexts:    ['Software Engineer', 'Technical Project Manager', 'Entrepreneur', 'Human Rights Activist'],
      statusBadge:    'Open to new opportunities',
      introPara:      '',
      primaryTitle:   'Software Engineer & Technical Project Manager',
      primaryCompany: 'Arbree Limited',
      secondaryLines: [
        'Founder & CEO · Technonix',
        'Joint Secretary · Bangladesh Human Rights Enforcement Foundation',
      ],
      primaryEmail: 'nazmussakibsiraji@gmail.com',
    },
  });
  console.log('✅ Hero config');

  // ── Stats ─────────────────────────────────────────────────────────────────
  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { value: '7+',  label: 'Years Experience',   order: 0 },
      { value: '30+', label: 'Projects Delivered',  order: 1 },
      { value: '5+',  label: 'Countries',           order: 2 },
    ],
  });
  console.log('✅ Stats');

  // ── Skills ────────────────────────────────────────────────────────────────
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      // Tech
      { name: 'Next.js',        category: 'tech',       subcategory: 'Frontend',  order: 0 },
      { name: 'Node.js',        category: 'tech',       subcategory: 'Backend',   order: 1 },
      { name: 'PostgreSQL',     category: 'tech',       subcategory: 'Database',  order: 2 },
      { name: 'MongoDB',        category: 'tech',       subcategory: 'Database',  order: 3 },
      { name: 'Laravel',        category: 'tech',       subcategory: 'Backend',   order: 4 },
      { name: 'Flutter',        category: 'tech',       subcategory: 'Mobile',    order: 5 },
      { name: 'Kotlin',         category: 'tech',       subcategory: 'Mobile',    order: 6 },
      { name: 'WordPress',      category: 'tech',       subcategory: 'CMS',       order: 7 },
      { name: 'Figma',          category: 'tech',       subcategory: 'Design',    order: 8 },
      { name: 'DigitalOcean',   category: 'tech',       subcategory: 'Infra',     order: 9 },
      // PM
      { name: 'Agile / Scrum',           category: 'pm',         subcategory: 'Delivery',   order: 0 },
      { name: 'Stakeholder Management',  category: 'pm',         subcategory: 'Leadership', order: 1 },
      { name: 'Product Roadmapping',     category: 'pm',         subcategory: 'Strategy',   order: 2 },
      { name: 'Risk & Budget Control',   category: 'pm',         subcategory: 'Delivery',   order: 3 },
      { name: 'Cross-functional Teams',  category: 'pm',         subcategory: 'Leadership', order: 4 },
      { name: 'Market Entry Strategy',   category: 'pm',         subcategory: 'Strategy',   order: 5 },
      { name: 'Client Communication',    category: 'pm',         subcategory: 'Leadership', order: 6 },
      { name: 'Process Optimisation',    category: 'pm',         subcategory: 'Delivery',   order: 7 },
      // Consulting
      { name: 'Business Strategy',       category: 'consulting', subcategory: 'Strategy',   order: 0 },
      { name: 'Digital Marketing',       category: 'consulting', subcategory: 'Marketing',  order: 1 },
      { name: 'Brand Development',       category: 'consulting', subcategory: 'Marketing',  order: 2 },
      { name: 'SEO & Growth',            category: 'consulting', subcategory: 'Marketing',  order: 3 },
      { name: 'Market Research',         category: 'consulting', subcategory: 'Strategy',   order: 4 },
      { name: 'IT Consulting',           category: 'consulting', subcategory: 'Advisory',   order: 5 },
      { name: 'Go-to-Market Planning',   category: 'consulting', subcategory: 'Strategy',   order: 6 },
      // Advocacy
      { name: 'Human Rights Law',        category: 'advocacy',   subcategory: 'Legal',      order: 0 },
      { name: 'Policy Development',      category: 'advocacy',   subcategory: 'Governance', order: 1 },
      { name: 'Community Outreach',      category: 'advocacy',   subcategory: 'Outreach',   order: 2 },
      { name: 'Legal Aid Coordination',  category: 'advocacy',   subcategory: 'Legal',      order: 3 },
      { name: 'Awareness Campaigns',     category: 'advocacy',   subcategory: 'Outreach',   order: 4 },
      { name: 'Societal Development',    category: 'advocacy',   subcategory: 'Governance', order: 5 },
    ],
  });
  console.log('✅ Skills (tech + PM + Consulting + Advocacy)');

  // ── Services ──────────────────────────────────────────────────────────────
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      { number: '01', icon: 'Briefcase',      title: 'Business Consultation',        description: 'Strategic guidance for digital transformation, market entry, and operational efficiency — backed by real-world cross-continental experience.', tags: ['Strategy', 'Advisory', 'Market Entry'], order: 0 },
      { number: '02', icon: 'Code2',          title: 'Web & App Development',        description: 'End-to-end development of web platforms and mobile applications — from lean MVPs to enterprise-grade, scalable systems.', tags: ['Next.js', 'Flutter', 'Node.js'], order: 1 },
      { number: '03', icon: 'Megaphone',      title: 'Digital Marketing & Branding', description: 'Comprehensive digital presence strategy — brand identity, content marketing, and performance campaigns that drive measurable growth.', tags: ['Brand Strategy', 'SEO', 'Campaigns'], order: 2 },
      { number: '04', icon: 'ClipboardList',  title: 'Project Management',           description: 'Agile and structured PM for complex, multi-team software projects — ensuring on-time delivery, client alignment, and quality at scale.', tags: ['Agile', 'Cross-functional', 'Delivery'], order: 3 },
      { number: '05', icon: 'HeartHandshake', title: 'Human Rights Activities',      description: 'Leveraging technology and advocacy to promote human rights, legal awareness, and social justice through the BHREF.', tags: ['Advocacy', 'Legal', 'Social Impact'], order: 4 },
      { number: '06', icon: 'Server',         title: 'Server & Infrastructure',      description: 'DigitalOcean provisioning, CI/CD pipelines, database management, and performance optimisation for reliable deployments.', tags: ['DigitalOcean', 'DevOps', 'Performance'], order: 5 },
    ],
  });
  console.log('✅ Services');

  // ── Experience ────────────────────────────────────────────────────────────
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      { period: 'Sep 2024 – Present', startDate: new Date('2024-09-01'), endDate: null, role: 'Technical Project Manager', company: 'Arbree Solutions', description: 'Managing multiple software operations, overseeing product planning and implementation, and maintaining active communication with clients across global markets.', projects: ['Virtual education platform for Planet Education Network (UK)', 'Sportigy — sportsman marketplace', 'Mobile app for ChargeAI', 'Export-import analytical tool for UAE Customs', 'HRM software for Munshi Group'], note: 'Coordinating Dubai & UK operations.', isCurrent: true, order: 0 },
      { period: 'Jan 2024 – Aug 2024', startDate: new Date('2024-01-01'), endDate: new Date('2024-08-31'), role: 'Senior Executive, Project Management', company: 'OPUS Technology Limited', description: 'Oversaw product implementation and client communication for global operations spanning Africa, South Asia, and Southeast Asia.', projects: ['Microfinance platform in Uganda, Kenya & Zambia (Murfin Inc.)', 'Server management & BI reports (Teletalk)', 'Core banking software for Lanka Bangla Finance Ltd.'], note: 'Coordinated Dubai & Malaysian operations.', isCurrent: false, order: 1 },
      { period: 'Jun 2023 – Dec 2023', startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), role: 'Executive, Project Management', company: 'HyperTAG Solutions Ltd.', description: 'Managed Belancer product and launched innovative accounting software.', projects: ['Belancer — freelance marketplace', 'Cyber Security Training for Government Officials (World Bank aligned)'], note: null, isCurrent: false, order: 2 },
      { period: 'Jun 2022 – May 2023', startDate: new Date('2022-06-01'), endDate: new Date('2023-05-31'), role: 'Software Engineer', company: 'Masleap Inc.', description: 'Developed high-quality cross-platform mobile and web applications using Laravel, Kotlin, and Flutter.', projects: ['Android app for HISA (USA)', 'Cross-platform app for Inkistry', 'TripBeyond — flight booking software'], note: null, isCurrent: false, order: 3 },
      { period: 'Jul 2019 – May 2022', startDate: new Date('2019-07-01'), endDate: new Date('2022-05-31'), role: 'Software Developer → Operation Manager', company: 'Koderden Technologies Ltd.', description: 'Progressed from software developer to operations leadership.', projects: ['Job Link Corporate', 'EuroBangla Times', 'Tolet Management System'], note: null, isCurrent: false, order: 4 },
      { period: 'Apr 2015 – Jun 2019', startDate: new Date('2015-04-01'), endDate: new Date('2019-06-30'), role: 'Operation Executive', company: 'Opro Infotech LTD', description: 'Managed project timelines, budgets, and quality standards.', projects: [], note: null, isCurrent: false, order: 5 },
    ],
  });
  console.log('✅ Experience');

  // ── Education ─────────────────────────────────────────────────────────────
  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      { type: 'University',            year: '2021', degree: 'Bachelor of Science in Computer Science & Engineering', institution: 'North South University',          highlight: true,  order: 0 },
      { type: 'Higher Secondary (HSC)', year: '2014', degree: 'HSC — Science',                                        institution: 'Dhaka Residential Model College', highlight: false, order: 1 },
      { type: 'Secondary (SSC)',        year: '2012', degree: 'SSC — Science',                                        institution: 'Dhaka Residential Model College', highlight: false, order: 2 },
    ],
  });
  console.log('✅ Education');

  // ── Clients ───────────────────────────────────────────────────────────────
  await prisma.client.deleteMany();
  await prisma.client.createMany({
    data: [
      { name: 'Planet Education Network', company: 'Arbree',   order: 0 },
      { name: 'Sportigy',                 company: 'Arbree',   order: 1 },
      { name: 'ChargeAI',                 company: 'Arbree',   order: 2 },
      { name: 'UAE Customs',              company: 'Arbree',   order: 3 },
      { name: 'Munshi Group',             company: 'Arbree',   order: 4 },
      { name: 'Murfin Inc.',              company: 'Opus',     order: 0 },
      { name: 'Teletalk',                 company: 'Opus',     order: 1 },
      { name: 'Lanka Bangla Finance',     company: 'Opus',     order: 2 },
      { name: 'Belancer',                 company: 'HyperTag', order: 0 },
      { name: 'HISA (USA)',               company: 'Masleap',  order: 0 },
      { name: 'Inkistry',                 company: 'Masleap',  order: 1 },
      { name: 'TripBeyond',               company: 'Masleap',  order: 2 },
      { name: 'Job Link Corporate',       company: 'Koderden', order: 0 },
      { name: 'EuroBangla Times',         company: 'Koderden', order: 1 },
    ],
  });
  console.log('✅ Clients');

  // ── Footer Config ─────────────────────────────────────────────────────────
  await prisma.footerConfig.upsert({
    where:  { id: 'main' },
    update: {},
    create: {
      id:            'main',
      tagline:       'Building technology with purpose.',
      description:   'Software Engineer, Technical Project Manager, and Entrepreneur passionate about building scalable solutions and advocating for human dignity.',
      copyrightName: 'Nazmus Sakib Siraji',
    },
  });
  console.log('✅ Footer config');

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
