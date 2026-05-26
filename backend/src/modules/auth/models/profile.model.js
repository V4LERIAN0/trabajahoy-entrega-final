import { EntitySchema } from 'typeorm';

export const Profile = new EntitySchema({
  name: 'Profile',
  tableName: 'profiles',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    passwordHash: {
      name: 'password_hash',
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    firstName: {
      name: 'first_name',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    avatarUrl: {
      name: 'avatar_url',
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      nullable: false,
      default: true,
    },
    isVerified: {
      name: 'is_verified',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    emailVerifiedAt: {
      name: 'email_verified_at',
      type: 'timestamp',
      nullable: true,
    },
    lastLoginAt: {
      name: 'last_login_at',
      type: 'timestamp',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    roles: {
      type: 'many-to-many',
      target: 'Role',
      joinTable: {
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
      },
    },
    ownedCompany: {
      type: 'one-to-many',
      target: 'Company',
      inverseSide: 'owner',
    },
    candidateProfile: {
      type: 'one-to-one',
      target: 'CandidateProfile',
      inverseSide: 'user',
    },
    companyMemberships: {
      type: 'one-to-many',
      target: 'CompanyMember',
      inverseSide: 'user',
    },
  },
  indices: [
    {
      name: 'IDX_profiles_email',
      columns: ['email'],
      unique: true,
    },
  ],
});
