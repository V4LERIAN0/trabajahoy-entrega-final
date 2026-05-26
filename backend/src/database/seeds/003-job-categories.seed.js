export async function seedJobCategories(dataSource) {
  console.log('Seeding job categories...');

  const queryRunner = dataSource.createQueryRunner();

  try {
    const existing = await queryRunner.query(
      `SELECT id FROM job_categories WHERE slug = 'technology'`,
    );
    if (existing.length > 0) {
      console.log('Job categories already exist. Skipping.');
      return {};
    }

    const categories = [
      // Parent categories
      { name: 'Technology', slug: 'technology', description: 'Software development, IT, and tech roles' },
      { name: 'Design', slug: 'design', description: 'UX/UI, graphic design, and creative roles' },
      { name: 'Marketing', slug: 'marketing', description: 'Digital marketing, SEO, and growth roles' },
      { name: 'Sales', slug: 'sales', description: 'Sales, business development, and account management' },
      { name: 'Finance', slug: 'finance', description: 'Accounting, finance, and banking roles' },
      { name: 'Human Resources', slug: 'human-resources', description: 'HR, recruiting, and talent management' },
      { name: 'Operations', slug: 'operations', description: 'Operations, logistics, and supply chain' },
      { name: 'Customer Service', slug: 'customer-service', description: 'Customer support and success roles' },
    ];

    for (const cat of categories) {
      await queryRunner.query(
        `INSERT INTO job_categories (name, slug, description, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [cat.name, cat.slug, cat.description],
      );
    }

    // Now add subcategories with parent references
    const parentCategories = await queryRunner.query(`SELECT id, slug FROM job_categories WHERE parent_id IS NULL`);
    const parentMap = parentCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {});

    const subcategories = [
      { name: 'Software Development', slug: 'software-development', description: 'Frontend, backend, full-stack development', parentSlug: 'technology' },
      { name: 'Data Science', slug: 'data-science', description: 'Data analysis, machine learning, AI', parentSlug: 'technology' },
      { name: 'DevOps', slug: 'devops', description: 'Infrastructure, CI/CD, cloud operations', parentSlug: 'technology' },
      { name: 'Mobile Development', slug: 'mobile-development', description: 'iOS, Android, React Native, Flutter', parentSlug: 'technology' },
      { name: 'UX/UI Design', slug: 'ux-ui-design', description: 'User experience and interface design', parentSlug: 'design' },
      { name: 'Graphic Design', slug: 'graphic-design', description: 'Visual design, branding, illustration', parentSlug: 'design' },
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, SEM, social media marketing', parentSlug: 'marketing' },
      { name: 'Content Marketing', slug: 'content-marketing', description: 'Content strategy, copywriting, blogging', parentSlug: 'marketing' },
    ];

    for (const sub of subcategories) {
      await queryRunner.query(
        `INSERT INTO job_categories (name, slug, description, parent_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [sub.name, sub.slug, sub.description, parentMap[sub.parentSlug]],
      );
    }

    console.log(`✅ ${categories.length + subcategories.length} job categories created`);

    // Return all category IDs for use in other seeds
    const allCategories = await queryRunner.query(`SELECT id, slug FROM job_categories`);
    return allCategories.reduce((acc, cat) => {
      acc[cat.slug.replace(/-/g, '_')] = cat.id;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error seeding job categories:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
