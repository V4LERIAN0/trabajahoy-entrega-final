import { AppDataSource } from '../src/database/data-source.js';

async function truncate() {
  const ds = await AppDataSource.initialize();
  const qr = ds.createQueryRunner();

  try {
    console.log('Truncating tables...');
    const tables = [
      'forum_posts', 'forum_threads', 'forum_reports', 'forum_categories',
      'resource_ratings', 'resource_related', 'resources', 'resource_categories',
      'application_status_history', 'application_comments', 'saved_jobs',
      'candidate_company_follows', 'job_applications',
      'vacancy_benefits', 'vacancy_skills', 'vacancies',
      'company_verification_documents', 'company_verification_submissions',
      'company_members', 'company_benefits', 'company_locations', 'companies',
      'candidate_interests', 'candidate_cv_files', 'candidate_languages',
      'candidate_skills', 'candidate_education', 'candidate_experiences',
      'candidate_profiles', 'user_roles', 'profiles', 'job_categories',
    ];

    for (const t of tables) {
      await qr.query(`TRUNCATE TABLE "${t}" CASCADE`).catch((e) => {
        console.log(`  ⚠️  ${t}: ${e.message.split('\n')[0]}`);
      });
      console.log(`  ✅ ${t}`);
    }

    console.log('\nDone!');
  } finally {
    await qr.release();
    await ds.destroy();
  }
}

truncate();
