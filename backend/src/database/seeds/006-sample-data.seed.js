import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

export async function seedAllSampleData(dataSource) {
  console.log('Seeding sample data (users, companies, vacancies)...');

  const queryRunner = dataSource.createQueryRunner();

  try {
    const existing = await queryRunner.query(`SELECT id FROM companies LIMIT 1`);
    if (existing.length > 0) {
      console.log('Sample data already exists. Skipping.');
      return;
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const adminId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    console.log('\n--- Creating Users ---');

    const companyUsers = [
      { email: 'owner@techcorp.com', firstName: 'Carlos', lastName: 'Mendoza', phone: '+52 55 1234 5678' },
      { email: 'owner@innovasoft.com', firstName: 'Maria', lastName: 'Rodriguez', phone: '+52 55 2345 6789' },
      { email: 'owner@globaldata.com', firstName: 'Andres', lastName: 'Silva', phone: '+52 55 3456 7890' },
      { email: 'owner@creativadigital.com', firstName: 'Laura', lastName: 'Garcia', phone: '+52 55 4567 8901' },
      { email: 'owner@cloudservices.com', firstName: 'Roberto', lastName: 'Martinez', phone: '+52 55 5678 9012' },
      { email: 'recruiter@techcorp.com', firstName: 'Sofia', lastName: 'Hernandez', phone: '+52 55 6789 0123' },
      { email: 'recruiter@innovasoft.com', firstName: 'Diego', lastName: 'Lopez', phone: '+52 55 7890 1234' },
    ];

    const recruiterRole = await queryRunner.query(`SELECT id FROM roles WHERE name = 'recruiter' LIMIT 1`);
    const userIdMap = {};

    for (const user of companyUsers) {
      const r = await queryRunner.query(
        `INSERT INTO profiles (email, password_hash, first_name, last_name, phone, is_active, is_verified, email_verified_at, created_at, updated_at)
         VALUES (${esc(user.email)}, ${esc(passwordHash)}, ${esc(user.firstName)}, ${esc(user.lastName)}, ${esc(user.phone)}, true, true, NOW(), NOW(), NOW())
         RETURNING id`,
      );
      userIdMap[user.email] = r[0].id;

      if (recruiterRole.length > 0) {
        await queryRunner.query(
          `INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
           VALUES ('${r[0].id}', '${recruiterRole[0].id}', '${adminId}', NOW())`,
        );
      }
    }
    console.log(`✅ ${companyUsers.length} company users created`);

    console.log('\n--- Creating Companies ---');

    const companiesData = [
      {
        name: 'TechCorp Mexico', ownerEmail: 'owner@techcorp.com',
        description: 'Leading technology company specializing in cloud solutions, AI, and enterprise software.',
        website: 'https://techcorp.mx', industry: 'Technology', size: '201-500', isVerified: true,
        locations: [{ country: 'Mexico', city: 'Mexico City', address: 'Av. Reforma 222, CDMX', isHq: true }],
        benefits: [{ name: 'Health Insurance', icon: '🏥' }, { name: 'Remote Work', icon: '🏠' }, { name: 'Training Budget', icon: '📚' }],
        members: [{ email: 'owner@techcorp.com', role: 'owner' }, { email: 'recruiter@techcorp.com', role: 'recruiter' }],
      },
      {
        name: 'InnovaSoft', ownerEmail: 'owner@innovasoft.com',
        description: 'Software development studio focused on mobile apps and web platforms.',
        website: 'https://innovasoft.io', industry: 'Software Development', size: '51-200', isVerified: true,
        locations: [{ country: 'Mexico', city: 'Guadalajara', address: 'Av. Americas 1500', isHq: true }],
        benefits: [{ name: 'Equity Options', icon: '📈' }, { name: 'Flexible Hours', icon: '⏰' }],
        members: [{ email: 'owner@innovasoft.com', role: 'owner' }],
      },
      {
        name: 'GlobalData Analytics', ownerEmail: 'owner@globaldata.com',
        description: 'Data analytics and business intelligence company.',
        website: 'https://globaldata.com', industry: 'Data Analytics', size: '501-1000', isVerified: true,
        locations: [{ country: 'Mexico', city: 'Monterrey', address: 'Av. Constitución 789', isHq: true }],
        benefits: [{ name: 'Health Insurance', icon: '🏥' }, { name: 'Performance Bonus', icon: '💰' }],
        members: [{ email: 'owner@globaldata.com', role: 'owner' }],
      },
      {
        name: 'Creativa Digital Agency', ownerEmail: 'owner@creativadigital.com',
        description: 'Full-service digital agency specializing in branding and web design.',
        website: 'https://creativadigital.mx', industry: 'Marketing & Advertising', size: '11-50', isVerified: false,
        locations: [{ country: 'Mexico', city: 'Mexico City', address: 'Col. Roma Norte, CDMX', isHq: true }],
        benefits: [{ name: 'Remote Fridays', icon: '🏠' }],
        members: [{ email: 'owner@creativadigital.com', role: 'owner' }],
      },
      {
        name: 'CloudServices Pro', ownerEmail: 'owner@cloudservices.com',
        description: 'Cloud infrastructure and DevOps consulting company.',
        website: 'https://cloudservices.pro', industry: 'Cloud Computing', size: '51-200', isVerified: true,
        locations: [{ country: 'Mexico', city: 'Puebla', address: 'Blvd. Héroes 500', isHq: true }],
        benefits: [{ name: 'AWS Certifications', icon: '🏆' }, { name: 'Remote Work', icon: '🏠' }],
        members: [{ email: 'owner@cloudservices.com', role: 'owner' }],
      },
    ];

    const companyIdMap = {};

    for (const comp of companiesData) {
      const r = await queryRunner.query(
        `INSERT INTO companies (owner_id, name, description, website, industry, size, is_verified, created_at, updated_at)
         VALUES ('${userIdMap[comp.ownerEmail]}', ${esc(comp.name)}, ${esc(comp.description)}, ${esc(comp.website)}, ${esc(comp.industry)}, ${esc(comp.size)}, ${comp.isVerified}, NOW(), NOW())
         RETURNING id`,
      );
      companyIdMap[comp.name] = r[0].id;

      for (const loc of comp.locations) {
        await queryRunner.query(
          `INSERT INTO company_locations (company_id, country, city, address, is_headquarters, created_at, updated_at)
           VALUES ('${r[0].id}', ${esc(loc.country)}, ${esc(loc.city)}, ${esc(loc.address)}, ${loc.isHq}, NOW(), NOW())`,
        );
      }

      for (const ben of comp.benefits) {
        await queryRunner.query(
          `INSERT INTO company_benefits (company_id, name, icon, created_at, updated_at)
           VALUES ('${r[0].id}', ${esc(ben.name)}, ${esc(ben.icon)}, NOW(), NOW())`,
        );
      }

      for (const mem of comp.members) {
        await queryRunner.query(
          `INSERT INTO company_members (company_id, user_id, role, joined_at)
           VALUES ('${r[0].id}', '${userIdMap[mem.email]}', '${mem.role}', NOW())`,
        );
      }
    }
    console.log(`✅ ${companiesData.length} companies created`);

    console.log('\n--- Creating Vacancies ---');

    const categories = await queryRunner.query(`SELECT id, slug FROM job_categories`);
    const catMap = categories.reduce((acc, c) => { acc[c.slug] = c.id; return acc; }, {});

    const vacanciesData = [
      { title: 'Senior React Developer', company: 'TechCorp Mexico', cat: 'software-development', desc: 'We are looking for a Senior React Developer to join our team.', reqs: '- 5+ years of React\n- Strong TypeScript skills', sMin: 60000, sMax: 90000, type: 'full-time', mod: 'hybrid', level: 'senior', country: 'Mexico', city: 'Mexico City', openings: 2, skills: ['React', 'TypeScript'], benefits: ['Health Insurance', 'Remote Work'] },
      { title: 'Backend Node.js Developer', company: 'TechCorp Mexico', cat: 'software-development', desc: 'Join our backend team to build scalable microservices.', reqs: '- 3+ years of Node.js\n- PostgreSQL experience', sMin: 50000, sMax: 75000, type: 'full-time', mod: 'remote', level: 'mid', country: 'Mexico', city: 'Guadalajara', openings: 3, skills: ['Node.js', 'PostgreSQL'], benefits: ['Health Insurance'] },
      { title: 'UX/UI Designer', company: 'InnovaSoft', cat: 'ux-ui-design', desc: 'Create intuitive interfaces for mobile and web apps.', reqs: '- 3+ years UX/UI\n- Proficiency in Figma', sMin: 45000, sMax: 65000, type: 'full-time', mod: 'hybrid', level: 'mid', country: 'Mexico', city: 'Guadalajara', openings: 1, skills: ['Figma', 'User Research'], benefits: ['Equity Options'] },
      { title: 'Data Scientist', company: 'GlobalData Analytics', cat: 'data-science', desc: 'Build predictive models and ML solutions.', reqs: "- Master's in CS or related\n- Python and ML frameworks", sMin: 70000, sMax: 100000, type: 'full-time', mod: 'hybrid', level: 'senior', country: 'Mexico', city: 'Monterrey', openings: 2, skills: ['Python', 'TensorFlow'], benefits: ['Health Insurance'] },
      { title: 'Digital Marketing Specialist', company: 'Creativa Digital Agency', cat: 'digital-marketing', desc: 'Manage SEO, SEM, and social media campaigns.', reqs: '- 3+ years digital marketing\n- Strong SEO knowledge', sMin: 35000, sMax: 50000, type: 'full-time', mod: 'hybrid', level: 'mid', country: 'Mexico', city: 'Mexico City', openings: 1, skills: ['SEO', 'Google Analytics'], benefits: ['Remote Fridays'] },
      { title: 'DevOps Engineer', company: 'CloudServices Pro', cat: 'devops', desc: 'Help clients migrate to cloud infrastructure.', reqs: '- 3+ years DevOps\n- AWS knowledge', sMin: 65000, sMax: 95000, type: 'full-time', mod: 'remote', level: 'senior', country: 'Mexico', city: 'Puebla', openings: 2, skills: ['AWS', 'Kubernetes'], benefits: ['AWS Certifications'] },
      { title: 'Junior Frontend Developer', company: 'InnovaSoft', cat: 'software-development', desc: 'Great opportunity for a junior developer.', reqs: '- 0-1 years experience\n- HTML, CSS, JavaScript', sMin: 25000, sMax: 35000, type: 'full-time', mod: 'hybrid', level: 'junior', country: 'Mexico', city: 'Guadalajara', openings: 2, skills: ['JavaScript', 'React'], benefits: ['Flexible Hours'] },
      { title: 'Cloud Architect', company: 'CloudServices Pro', cat: 'devops', desc: 'Lead cloud architecture for enterprise clients.', reqs: '- 7+ years IT infrastructure\n- AWS/Azure certifications', sMin: 120000, sMax: 160000, type: 'full-time', mod: 'remote', level: 'lead', country: 'Mexico', city: 'Mexico City', openings: 1, skills: ['AWS', 'Azure'], benefits: ['AWS Certifications'] },
      { title: 'iOS Developer', company: 'InnovaSoft', cat: 'mobile-development', desc: '6-month contract for iOS development.', reqs: '- 3+ years iOS\n- Swift proficiency', sMin: 55000, sMax: 70000, type: 'contract', mod: 'remote', level: 'mid', country: 'Mexico', city: 'Guadalajara', openings: 1, skills: ['Swift', 'iOS'], benefits: ['Flexible Hours'] },
      { title: 'Data Analyst Intern', company: 'GlobalData Analytics', cat: 'data-science', desc: 'Internship in data analytics.', reqs: '- Student or recent graduate\n- Basic SQL', sMin: 12000, sMax: 18000, type: 'internship', mod: 'hybrid', level: 'junior', country: 'Mexico', city: 'Monterrey', openings: 3, skills: ['SQL', 'Python'], benefits: ['Conference Attendance'] },
      { title: 'Graphic Designer', company: 'Creativa Digital Agency', cat: 'graphic-design', desc: 'Work on branding and marketing materials.', reqs: '- 2+ years graphic design\n- Adobe Creative Suite', sMin: 30000, sMax: 42000, type: 'full-time', mod: 'onsite', level: 'mid', country: 'Mexico', city: 'Mexico City', openings: 1, skills: ['Photoshop', 'Illustrator'], benefits: ['Remote Fridays'] },
      { title: 'Technical Lead - Backend', company: 'GlobalData Analytics', cat: 'software-development', desc: 'Lead backend engineering team.', reqs: '- 8+ years backend\n- Python or Node.js', sMin: 130000, sMax: 170000, type: 'full-time', mod: 'hybrid', level: 'lead', country: 'Mexico', city: 'Monterrey', openings: 1, skills: ['Python', 'Leadership'], benefits: ['Health Insurance'] },
      { title: 'Content Marketing Manager', company: 'Creativa Digital Agency', cat: 'content-marketing', desc: 'Develop content strategies.', reqs: '- 3+ years content marketing\n- Writing skills', sMin: 40000, sMax: 55000, type: 'full-time', mod: 'hybrid', level: 'mid', country: 'Mexico', city: 'Mexico City', openings: 1, skills: ['Content Strategy', 'SEO'], benefits: ['Remote Fridays'] },
      { title: 'React Native Developer', company: 'InnovaSoft', cat: 'mobile-development', desc: 'Build cross-platform mobile apps.', reqs: '- 2+ years React Native', sMin: 40000, sMax: 60000, type: 'freelance', mod: 'remote', level: 'mid', country: 'Mexico', city: 'Guadalajara', openings: 2, skills: ['React Native'], benefits: ['Flexible Hours'] },
      { title: 'Product Manager', company: 'TechCorp Mexico', cat: 'technology', desc: 'Lead strategy for our SaaS platform.', reqs: '- 4+ years product management\n- Agile', sMin: 80000, sMax: 120000, type: 'full-time', mod: 'hybrid', level: 'manager', country: 'Mexico', city: 'Mexico City', openings: 1, skills: ['Product Strategy', 'Agile'], benefits: ['Health Insurance'] },
    ];

    for (const vac of vacanciesData) {
      const r = await queryRunner.query(
        `INSERT INTO vacancies (company_id, category_id, title, description, requirements, salary_min, salary_max, type, modality, level, status, country, city, openings, published_at, created_at, updated_at)
         VALUES ('${companyIdMap[vac.company]}', '${catMap[vac.cat]}', ${esc(vac.title)}, ${esc(vac.desc)}, ${esc(vac.reqs)}, ${vac.sMin}, ${vac.sMax}, '${vac.type}', '${vac.mod}', '${vac.level}', 'published', ${esc(vac.country)}, ${esc(vac.city)}, ${vac.openings}, NOW(), NOW(), NOW())
         RETURNING id`,
      );
      const vid = r[0].id;

      for (const sk of vac.skills) {
        await queryRunner.query(
          `INSERT INTO vacancy_skills (vacancy_id, skill_name, is_required) VALUES ('${vid}', ${esc(sk)}, true)`,
        );
      }

      for (const ben of vac.benefits) {
        await queryRunner.query(
          `INSERT INTO vacancy_benefits (vacancy_id, benefit_name) VALUES ('${vid}', ${esc(ben)})`,
        );
      }
    }

    console.log(`✅ ${vacanciesData.length} vacancies created`);
    console.log('\n✅ Sample data seeding completed!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
