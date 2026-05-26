export async function seedForumCategories(dataSource) {
  console.log('Seeding forum categories...');

  const queryRunner = dataSource.createQueryRunner();

  try {
    const existing = await queryRunner.query(
      `SELECT id FROM forum_categories WHERE slug = 'general-discussion'`,
    );
    if (existing.length > 0) {
      console.log('Forum categories already exist. Skipping.');
      return {};
    }

    const categories = [
      { name: 'General Discussion', slug: 'general-discussion', description: 'General topics about jobs and careers', icon: '💬', sortOrder: 1 },
      { name: 'Job Search Tips', slug: 'job-search-tips', description: 'Share and discuss job search strategies', icon: '🔍', sortOrder: 2 },
      { name: 'Interview Experiences', slug: 'interview-experiences', description: 'Share your interview experiences', icon: '🎯', sortOrder: 3 },
      { name: 'Tech Questions', slug: 'tech-questions', description: 'Ask and answer technical questions', icon: '💻', sortOrder: 4 },
      { name: 'Salary & Benefits', slug: 'salary-benefits', description: 'Discuss compensation and benefits', icon: '💰', sortOrder: 5 },
      { name: 'Company Reviews', slug: 'company-reviews', description: 'Discuss and review companies', icon: '🏢', sortOrder: 6 },
      { name: 'Remote Work', slug: 'remote-work-forum', description: 'Discuss remote work opportunities', icon: '🏠', sortOrder: 7 },
      { name: 'Feedback & Suggestions', slug: 'feedback-suggestions', description: 'Platform feedback and feature requests', icon: '📝', sortOrder: 8 },
    ];

    for (const cat of categories) {
      await queryRunner.query(
        `INSERT INTO forum_categories (name, slug, description, icon, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [cat.name, cat.slug, cat.description, cat.icon, cat.sortOrder],
      );
    }

    console.log(`✅ ${categories.length} forum categories created`);

    const allCategories = await queryRunner.query(`SELECT id, slug FROM forum_categories`);
    return allCategories.reduce((acc, cat) => {
      acc[cat.slug.replace(/-/g, '_')] = cat.id;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error seeding forum categories:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
