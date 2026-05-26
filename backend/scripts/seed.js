import { AppDataSource } from '../src/database/data-source.js';
import { seedRoles } from '../src/database/seeds/001-roles.seed.js';
import { seedAdmin } from '../src/database/seeds/002-admin.seed.js';
import { seedJobCategories } from '../src/database/seeds/003-job-categories.seed.js';
import { seedResourceCategories } from '../src/database/seeds/004-resource-categories.seed.js';
import { seedForumCategories } from '../src/database/seeds/005-forum-categories.seed.js';
import { seedCandidates } from '../src/database/seeds/007-candidates.seed.js';
import { seedAllSampleData } from '../src/database/seeds/006-sample-data.seed.js';

async function runSeeds() {
  let dataSource;

  try {
    console.log('🌱 Starting database seeding...\n');

    // Initialize database connection
    dataSource = await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    // Run seeds in order
    console.log('=== Phase 1: Base Categories ===');
    await seedRoles(dataSource);
    await seedAdmin(dataSource);
    await seedJobCategories(dataSource);
    await seedResourceCategories(dataSource);
    await seedForumCategories(dataSource);

    console.log('\n=== Phase 2: Candidates ===');
    await seedCandidates(dataSource);

    console.log('\n=== Phase 3: Sample Data (Users, Companies, Vacancies, etc) ===');
    await seedAllSampleData(dataSource);

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeeds();
