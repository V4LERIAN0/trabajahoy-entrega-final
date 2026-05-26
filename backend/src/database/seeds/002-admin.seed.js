import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

export async function seedAdmin(dataSource) {
  console.log('Seeding admin user...');

  const queryRunner = dataSource.createQueryRunner();
  
  try {
    // Check if admin user already exists
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM profiles WHERE email = 'admin@trabajahoy.com'`
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists. Skipping.');
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    await queryRunner.query(
      `INSERT INTO profiles (id, email, password_hash, first_name, last_name, is_active, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, true, NOW(), NOW())`,
      [adminId, 'admin@trabajahoy.com', passwordHash, 'Admin', 'User']
    );

    console.log('Admin user created with email: admin@trabajahoy.com');

    // Assign admin role to the user
    const roleResult = await queryRunner.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );

    if (roleResult.length > 0) {
      const roleId = roleResult[0].id;
      await queryRunner.query(
        `INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
         VALUES ($1, $2, $1, NOW())`,
        [adminId, roleId]
      );
      console.log('Admin role assigned to admin user');
    } else {
      console.log('Admin role not found. Skipping role assignment.');
    }

    console.log('Admin seed completed successfully!');
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
