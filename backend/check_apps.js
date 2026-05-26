import { AppDataSource } from './src/database/data-source.js';
import { JobApplication } from './src/modules/application/models/job-application.model.js';

async function check() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(JobApplication);
  const apps = await repo.find({ relations: ['user', 'vacancy', 'vacancy.company'] });
  console.log(JSON.stringify(apps, null, 2));
  process.exit(0);
}

check().catch(console.error);
