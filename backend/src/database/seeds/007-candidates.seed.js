import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

export async function seedCandidates(dataSource) {
  console.log('Seeding candidates...');

  const queryRunner = dataSource.createQueryRunner();

  try {
    const existing = await queryRunner.query(
      `SELECT id FROM candidate_profiles LIMIT 1`,
    );
    if (existing.length > 0) {
      console.log('Candidates already exist. Skipping.');
      return {};
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const adminId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    const candidates = [
      {
        email: 'candidate1@email.com', firstName: 'Juan', lastName: 'Perez', phone: '+52 55 1111 2222',
        bio: 'Full-stack developer with 5 years of experience in React, Node.js, and PostgreSQL.',
        headline: 'Senior Full-Stack Developer | React & Node.js',
        summary: 'Experienced developer specializing in modern web technologies.',
        location: 'Mexico City, Mexico', country: 'Mexico', city: 'Mexico City',
        website: 'https://juanperez.dev', availability: 'available',
        experiences: [
          { company: 'TechCorp', role: 'Senior Developer', desc: 'Led microservices development', start: '2021-03-01', end: null, current: true, loc: 'Mexico City' },
          { company: 'StartupXYZ', role: 'Full-Stack Developer', desc: 'Built React frontend and Node.js backend', start: '2019-01-01', end: '2021-02-28', current: false, loc: 'Remote' },
        ],
        education: [{ institution: 'UNAM', degree: "Bachelor's", field: 'Computer Science', start: '2014-08-01', end: '2018-06-30', grade: '9.2/10' }],
        skills: [
          { name: 'React', level: 'expert', years: 5 }, { name: 'Node.js', level: 'expert', years: 5 },
          { name: 'PostgreSQL', level: 'advanced', years: 4 }, { name: 'TypeScript', level: 'advanced', years: 3 },
        ],
        languages: [{ name: 'Spanish', prof: 'native' }, { name: 'English', prof: 'advanced' }],
        interests: ['Web Development', 'Open Source', 'Machine Learning'],
      },
      {
        email: 'candidate2@email.com', firstName: 'Ana', lastName: 'Torres', phone: '+52 55 2222 3333',
        bio: 'UX/UI Designer with a passion for creating intuitive user experiences.',
        headline: 'UX/UI Designer | Mobile & Web Design',
        location: 'Guadalajara, Mexico', country: 'Mexico', city: 'Guadalajara',
        website: 'https://anatorres.design', availability: 'available',
        experiences: [
          { company: 'DesignStudio', role: 'Senior UX Designer', desc: 'Led UX research for mobile apps', start: '2022-01-01', end: null, current: true, loc: 'Guadalajara' },
        ],
        education: [{ institution: 'ITESO', degree: "Bachelor's", field: 'Digital Design', start: '2016-08-01', end: '2020-06-30', grade: '9.5/10' }],
        skills: [
          { name: 'Figma', level: 'expert', years: 4 }, { name: 'User Research', level: 'advanced', years: 3 },
        ],
        languages: [{ name: 'Spanish', prof: 'native' }, { name: 'English', prof: 'intermediate' }],
        interests: ['UX Design', 'Accessibility'],
      },
      {
        email: 'candidate3@email.com', firstName: 'Miguel', lastName: 'Ramirez', phone: '+52 55 3333 4444',
        bio: 'Data scientist with expertise in machine learning and statistical analysis.',
        headline: 'Data Scientist | Machine Learning & Analytics',
        location: 'Monterrey, Mexico', country: 'Mexico', city: 'Monterrey',
        availability: 'available',
        experiences: [
          { company: 'DataCorp', role: 'Data Scientist', desc: 'Built predictive models', start: '2022-06-01', end: null, current: true, loc: 'Monterrey' },
        ],
        education: [{ institution: 'Tec de Monterrey', degree: "Master's", field: 'Data Science', start: '2020-08-01', end: '2022-06-30', grade: '9.8/10' }],
        skills: [
          { name: 'Python', level: 'expert', years: 4 }, { name: 'Machine Learning', level: 'advanced', years: 3 },
          { name: 'TensorFlow', level: 'advanced', years: 2 },
        ],
        languages: [{ name: 'Spanish', prof: 'native' }, { name: 'English', prof: 'advanced' }],
        interests: ['Machine Learning', 'AI'],
      },
      {
        email: 'candidate4@email.com', firstName: 'Valentina', lastName: 'Castro', phone: '+52 55 4444 5555',
        bio: 'Digital marketing specialist with 4 years of experience in SEO and SEM.',
        headline: 'Digital Marketing Specialist | SEO & Growth',
        location: 'Mexico City, Mexico', country: 'Mexico', city: 'Mexico City',
        availability: 'available',
        experiences: [
          { company: 'MarketingPro', role: 'SEO Specialist', desc: 'Managed SEO for 20+ clients', start: '2021-09-01', end: null, current: true, loc: 'Mexico City' },
        ],
        education: [{ institution: 'Universidad Iberoamericana', degree: "Bachelor's", field: 'Marketing', start: '2016-08-01', end: '2020-06-30', grade: '9.0/10' }],
        skills: [
          { name: 'SEO', level: 'expert', years: 4 }, { name: 'Google Analytics', level: 'advanced', years: 4 },
        ],
        languages: [{ name: 'Spanish', prof: 'native' }, { name: 'English', prof: 'advanced' }],
        interests: ['Digital Marketing', 'SEO'],
      },
      {
        email: 'candidate5@email.com', firstName: 'Diego', lastName: 'Morales', phone: '+52 55 5555 6666',
        bio: 'DevOps engineer with experience in cloud infrastructure and CI/CD.',
        headline: 'DevOps Engineer | AWS & Kubernetes',
        location: 'Puebla, Mexico', country: 'Mexico', city: 'Puebla',
        availability: 'available',
        experiences: [
          { company: 'CloudServices', role: 'DevOps Engineer', desc: 'Managed AWS infrastructure', start: '2021-01-01', end: null, current: true, loc: 'Remote' },
        ],
        education: [{ institution: 'BUAP', degree: "Bachelor's", field: 'Systems Engineering', start: '2015-08-01', end: '2019-06-30', grade: '8.8/10' }],
        skills: [
          { name: 'AWS', level: 'expert', years: 4 }, { name: 'Docker', level: 'expert', years: 4 },
          { name: 'Kubernetes', level: 'advanced', years: 3 },
        ],
        languages: [{ name: 'Spanish', prof: 'native' }, { name: 'English', prof: 'intermediate' }],
        interests: ['Cloud Computing', 'DevOps'],
      },
    ];

    const candidateRole = await queryRunner.query(`SELECT id FROM roles WHERE name = 'candidate' LIMIT 1`);

    for (const c of candidates) {
      // Start transaction for each candidate
      await queryRunner.startTransaction();
      try {
        // Insert profile
        const profileResult = await queryRunner.query(
          `INSERT INTO profiles (email, password_hash, first_name, last_name, phone, is_active, is_verified, email_verified_at, created_at, updated_at)
           VALUES (${esc(c.email)}, ${esc(passwordHash)}, ${esc(c.firstName)}, ${esc(c.lastName)}, ${esc(c.phone)}, true, true, NOW(), NOW(), NOW())
           RETURNING id`,
        );
        const pid = profileResult[0].id;
        console.log(`  Created profile: ${c.email} -> ${pid}`);

        // Assign candidate role
        if (candidateRole.length > 0) {
          await queryRunner.query(
            `INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
             VALUES ('${pid}', '${candidateRole[0].id}', '${adminId}', NOW())`,
          );
        }

        // Insert candidate profile and get its ID
        const cpResult = await queryRunner.query(
          `INSERT INTO candidate_profiles (user_id, bio, headline, summary, location, country, city, website, availability, created_at, updated_at)
           VALUES ('${pid}', ${esc(c.bio)}, ${esc(c.headline)}, ${esc(c.summary || null)}, ${esc(c.location)}, ${esc(c.country)}, ${esc(c.city)}, ${esc(c.website || null)}, ${esc(c.availability)}, NOW(), NOW())
           RETURNING id`,
        );
        const cid = cpResult[0].id;
        console.log(`  Created candidate_profile: profile_id=${pid}, candidate_profile_id=${cid}`);

        // Insert experiences
        for (const exp of c.experiences) {
          await queryRunner.query(
            `INSERT INTO candidate_experiences (candidate_id, company_name, role, description, start_date, end_date, is_current, location, created_at, updated_at)
             VALUES ('${cid}', ${esc(exp.company)}, ${esc(exp.role)}, ${esc(exp.desc)}, ${esc(exp.start)}, ${esc(exp.end)}, ${exp.current}, ${esc(exp.loc)}, NOW(), NOW())`,
          );
        }

        // Insert education
        for (const edu of c.education) {
          await queryRunner.query(
            `INSERT INTO candidate_education (candidate_id, institution, degree, field_of_study, start_date, end_date, grade, created_at, updated_at)
             VALUES ('${cid}', ${esc(edu.institution)}, ${esc(edu.degree)}, ${esc(edu.field)}, ${esc(edu.start)}, ${esc(edu.end)}, ${esc(edu.grade)}, NOW(), NOW())`,
          );
        }

        // Insert skills
        for (const sk of c.skills) {
          await queryRunner.query(
            `INSERT INTO candidate_skills (candidate_id, skill_name, level, years_of_experience, created_at, updated_at)
             VALUES ('${cid}', ${esc(sk.name)}, '${sk.level}', ${sk.years}, NOW(), NOW())`,
          );
        }

        // Insert languages
        for (const lang of c.languages) {
          await queryRunner.query(
            `INSERT INTO candidate_languages (candidate_id, language_name, proficiency, created_at, updated_at)
             VALUES ('${cid}', ${esc(lang.name)}, '${lang.prof}', NOW(), NOW())`,
          );
        }

        // Insert interests
        for (const interest of c.interests) {
          await queryRunner.query(
            `INSERT INTO candidate_interests (candidate_id, tag_name, created_at) VALUES ('${cid}', ${esc(interest)}, NOW())`,
          );
        }

        await queryRunner.commitTransaction();
        console.log(`  ✅ ${c.firstName} ${c.lastName} committed`);
      } catch (e) {
        await queryRunner.rollbackTransaction();
        console.error(`  ❌ Failed for ${c.email}:`, e.message);
        throw e;
      }
    }

    console.log(`✅ ${candidates.length} candidates created`);
  } catch (error) {
    console.error('Error seeding candidates:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
