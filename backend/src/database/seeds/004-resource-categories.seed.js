export async function seedResourceCategories(dataSource) {
  console.log('Seeding resource categories...');

  const queryRunner = dataSource.createQueryRunner();

  try {
    const existing = await queryRunner.query(
      `SELECT id FROM resource_categories WHERE slug = 'career-advice'`,
    );
    if (existing.length > 0) {
      console.log('Resource categories already exist. Skipping.');
      return {};
    }

    const categories = [
      { name: 'Career Advice', slug: 'career-advice', description: 'Tips and guidance for career growth' },
      { name: 'Resume & CV', slug: 'resume-cv', description: 'Resume writing tips and templates' },
      { name: 'Interview Prep', slug: 'interview-prep', description: 'Interview tips and common questions' },
      { name: 'Tech Tutorials', slug: 'tech-tutorials', description: 'Technical guides and tutorials' },
      { name: 'Industry News', slug: 'industry-news', description: 'Latest trends and news in the job market' },
      { name: 'Remote Work', slug: 'remote-work', description: 'Tips for remote work and productivity' },
    ];

    for (const cat of categories) {
      await queryRunner.query(
        `INSERT INTO resource_categories (name, slug, description, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [cat.name, cat.slug, cat.description || null],
      );
    }

    console.log(`✅ ${categories.length} resource categories created`);

    const allCategories = await queryRunner.query(`SELECT id, slug FROM resource_categories`);
    return allCategories.reduce((acc, cat) => {
      acc[cat.slug.replace(/-/g, '_')] = cat.id;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error seeding resource categories:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
