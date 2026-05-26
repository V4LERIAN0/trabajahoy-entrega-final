# TrabajaHoy Backend

> Backend API for the TrabajaHoy job board platform - connecting candidates with opportunities.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-red.svg)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Status](#-project-status)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Development Guidelines](#-development-guidelines)
- [Contributing](#-contributing)
- [Scripts](#-scripts)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

### Candidate Features (Implemented)
- ✅ User registration and authentication (JWT)
- ✅ Profile management (bio, experience, education, skills)
- ✅ CV upload and management
- ✅ Language proficiency tracking
- ✅ Interest tags management
- ✅ Job search and filtering (via vacancy module)
- ✅ Save/bookmark jobs (via application module)
- ✅ Apply to vacancies (via application module)
- ✅ Application status tracking

### Company Features (Implemented)
- ✅ Company profile creation and verification
- ✅ Job posting creation and management (via vacancy module)
- ✅ Company member management with role-based access
- ✅ Benefit catalog management
- ✅ Multi-location support
- ✅ Verification workflow with document upload

### Resource & Community Features (Implemented)
- ✅ Article/resource management with categories
- ✅ Resource ratings and related content
- ✅ Community forum with categories, threads, posts
- ✅ Content reporting system

### Admin Features (Implemented)
- ✅ User management with pagination and search
- ✅ Role assignment and removal
- ✅ Role-based user filtering
- ✅ View all roles with user counts
- ✅ Role-based access control (admin, recruiter, candidate, moderator)
- ✅ Job category management

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 5.x |
| **Database** | PostgreSQL | 15+ |
| **ORM** | TypeORM | 0.3.28 |
| **Validation** | Zod | 4.x |
| **Authentication** | JWT (jsonwebtoken) | 9.x |
| **Password Hashing** | bcryptjs | 3.x |
| **File Upload** | Multer | 2.x |
| **Dev Server** | Nodemon | 3.x |
| **Environment** | dotenv | 17.x |
| **CORS** | cors | 2.x |

---

## 📊 Project Status

**Current Phase:** Full Implementation

✅ **Completed:**
- Project structure and configuration
- Database schema design (21 tables)
- All database migrations (raw SQL)
- Dependency management (pnpm)
- Development environment setup
- **Auth module** - Registration, login, token refresh, logout, me endpoint
- **Candidate module** - Full profile CRUD, experiences, education, skills, languages, CV management, interests
- **Company module** - Full CRUD, locations, benefits, members, verification workflow
- **Admin module** - User management, role assignment/removal, role-based filtering
- **Vacancy module** - Job postings with categories, skills, benefits, management endpoints
- **Application module** - Job applications, saved jobs, company follows, comments, status tracking
- **Resource module** - Articles/resources with categories, ratings, related resources
- **Forum module** - Community forum with categories, threads, posts, reporting system
- Common utilities (bcrypt, JWT, logger, error handling, validation)
- Response interceptor with envelope pattern
- Supabase Storage integration for file uploads
- Swagger API documentation (development mode)

🚧 **In Progress:**
- Review module - Company reviews and ratings
- Notification module - User notifications and alerts

✅ **Recently Completed:**
- **Seed scripts** - Admin user seeding, database seeding infrastructure
- **Vacancy module** - Complete job posting management
- **Application module** - Full application lifecycle
- **Resource module** - Content management system
- **Forum module** - Community discussion platform

⏳ **Planned:**
- Testing framework setup
- CI/CD pipeline
- Production deployment configuration

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trabajahoy-backend.git
cd trabajahoy-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

> **Note:** This project uses [pnpm](https://pnpm.io/) as the package manager. If you don't have it installed, run `npm install -g pnpm` first.

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# See Environment Variables section below
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=trabajahoy

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

### Variable Descriptions

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | ✅ |
| `NODE_ENV` | Environment (development/production) | `development` | ✅ |
| `DB_HOST` | PostgreSQL host | `localhost` | ✅ |
| `DB_PORT` | PostgreSQL port | `5432` | ✅ |
| `DB_USERNAME` | Database username | `postgres` | ✅ |
| `DB_PASSWORD` | Database password | - | ✅ |
| `DB_NAME` | Database name | `trabajahoy` | ✅ |
| `JWT_SECRET` | Secret key for access tokens | - | ✅ |
| `JWT_EXPIRES_IN` | Access token expiration | `1h` | ✅ |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | - | ✅ |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | ✅ |

⚠️ **Security Note:** Never commit `.env` files to version control. Use strong, unique secrets in production.

---

## 🗄 Database Setup

### 1. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE trabajahoy;

# Enable UUID extension (required for migrations)
\c trabajahoy
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit
\q
```

### 2. Run Migrations

```bash
# Check migration status
pnpm run migration:show

# Run all pending migrations
pnpm run migration:run
```

### 3. Verify Migrations

```bash
# List all migrations
pnpm run migration:show
```

You should see 21 migrations marked as "Executed".

### Rollback Migration (if needed)

```bash
# Revert the last migration
pnpm run migration:revert
```

---

## 💻 Running the Application

### Development Mode

```bash
# Start development server with auto-reload
npm run dev
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Verify Server is Running

You should see output indicating the server is running. Test with:

```bash
curl http://localhost:3000/
```

---

## 📁 Project Structure

```
trabajahoy-backend/
├── .env.example                 # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
│
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md  # PR template
│   └── CONTRIBUTING.md           # Contribution guidelines
│
├── scripts/
│   ├── migrate.js              # Migration script
│   ├── migrate-revert.js       # Migration rollback script
│   └── seed.js                 # Database seeding script
│
└── src/
    ├── main.js                 # Application entry point
    │
    ├── common/                 # Shared utilities and infrastructure
    │   ├── config/
    │   │   ├── app.js          # Application configuration
    │   │   └── constants.js    # Constants (roles, enums, etc.)
    │   ├── dtos/
    │   │   └── pagination.dto.js  # Pagination parameters
    │   ├── middlewares/
    │   │   ├── auth.middleware.js    # JWT authentication
    │   │   ├── role.middleware.js    # Role-based authorization
    │   │   ├── validation.middleware.js  # Zod validation
    │   │   ├── upload.middleware.js    # File upload (Multer)
    │   │   └── error.middleware.js     # Error handling
    │   ├── repositories/
    │   │   └── base.repository.js    # Generic CRUD operations
    │   ├── swagger-docs/       # Swagger API documentation
    │   │   ├── auth.doc.js
    │   │   ├── candidate.doc.js
    │   │   ├── company.doc.js
    │   │   ├── admin.doc.js
    │   │   ├── vacancy.doc.js
    │   │   ├── application.doc.js
    │   │   ├── resource.doc.js
    │   │   ├── forum.doc.js
    │   │   └── swagger.config.js
    │   └── utils/
    │       ├── bcrypt.js         # Password hashing utilities
    │       ├── jwt.js            # JWT utilities
    │       ├── logger.js         # Logging utility
    │       ├── paginator.js      # Pagination helper
    │       └── storage.js        # Supabase storage utilities
    │
    ├── database/
    │   ├── data-source.js      # TypeORM DataSource configuration
    │   ├── migrations/         # Database migrations (21 files)
    │   │   ├── 001-CreateProfilesTable.js
    │   │   ├── 002-CreateRolesTable.js
    │   │   ├── 003-CreateUserRolesTable.js
    │   │   ├── 004-CreateCandidateProfilesTable.js
    │   │   ├── 005-CreateCandidateExperiencesTable.js
    │   │   ├── 006-CreateCandidateEducationTable.js
    │   │   ├── 007-CreateCandidateSkillsTable.js
    │   │   ├── 008-CreateCandidateLanguagesTable.js
    │   │   ├── 009-CreateCandidateCvFilesTable.js
    │   │   ├── 010-CreateCandidateInterestsTable.js
    │   │   ├── 011-CreateCompaniesTable.js
    │   │   ├── 012-CreateCompanyLocationsTable.js
    │   │   ├── 013-CreateCompanyBenefitsTable.js
    │   │   ├── 014-CreateCompanyMembersTable.js
    │   │   ├── 015-CreateCompanyVerificationSubmissionsTable.js
    │   │   ├── 016-CreateCompanyVerificationDocumentsTable.js
    │   │   ├── 017-CreateJobCategoriesTable.js
    │   │   ├── 018-CreateVacanciesTable.js
    │   │   ├── 019-CreateVacancySkillsTable.js
    │   │   ├── 020-CreateVacancyBenefitsTable.js
    │   │   └── 021-CreateSavedJobsTable.js
    │   └── seeds/              # Seed data files
    │       ├── 001-admin.seed.js
    │       ├── 002-sample-users.seed.js
    │       ├── 003-sample-jobs.seed.js
    │       └── 004-sample-companies.seed.js
    │
    └── modules/                # Feature modules
        ├── auth/               # ✅ Authentication (login, register, refresh)
        ├── candidate/          # ✅ Candidate profile & sub-resources
        ├── company/            # ✅ Company CRUD, locations, benefits, verification
        ├── admin/              # ✅ User & role management, admin tools
        ├── vacancy/            # ✅ Job postings, categories, skills, benefits
        ├── application/        # ✅ Applications, saved jobs, follows, comments
        ├── resource/           # ✅ Articles, categories, ratings
        ├── forum/              # ✅ Community forum, threads, posts, reports
        ├── review/             # ⏳ Company reviews (pending)
        └── notification/       # ⏳ Notifications (pending)
            ├── index.js
            ├── *.controller.js
            ├── *.service.js
            ├── *.repository.js
            ├── *.model.js
            ├── *.routes.js
            └── dtos/
                ├── create-*.dto.js
                └── update-*.dto.js
```

---

## 🏗 Architecture

### Layered Architecture Pattern

```
HTTP Request
    ↓
[Middleware Stack]
    ├── CORS
    ├── JSON Parser
    ├── Authentication (if required)
    ├── Authorization (if required)
    └── Validation (if required)
        ↓
[Routes] → [Controller] → [Service] → [Repository] → [Database]
              ↓              ↓              ↓
         Request/     Business      Data
         Response     Logic         Access
```

### Module Structure

Each feature module follows the same pattern:

```
module/
├── index.js                  # Module initialization
├── module.controller.js      # Request/response handling
├── module.service.js         # Business logic
├── module.repository.js      # Data access layer
├── module.model.js           # TypeORM entity
├── module.routes.js          # Route definitions
└── dtos/                     # Validation schemas
    ├── create-module.dto.js
    └── update-module.dto.js
```

### Key Design Principles

- **Separation of Concerns:** Each layer has a single responsibility
- **Dependency Injection:** Services receive repositories, controllers receive services
- **Validation at Boundaries:** Zod schemas validate all external inputs
- **Consistent Responses:** Standardized JSON response format
- **Security First:** Authentication, authorization, and input validation

---

## 🔌 API Endpoints

> Base URL: `http://localhost:3000/api`

### ✅ Implemented Endpoints

#### Authentication
```
POST   /api/auth/register       # Register new user (candidate role)
POST   /api/auth/login          # Login
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/logout         # Logout (requires auth)
GET    /api/auth/me             # Get current user profile (requires auth)
```

#### Candidate Profile (requires `candidate` role)
```
POST   /api/candidate/profile                    # Create profile
GET    /api/candidate/profile/:id                # Get profile by ID
PATCH  /api/candidate/profile/:id                # Update profile
DELETE /api/candidate/profile/:id                # Delete profile

# Experiences
GET    /api/candidate/profile/:id/experiences    # List experiences for candidate
POST   /api/candidate/profile/:candidateId/experiences  → Add experience
GET    /api/candidate/profile/experiences/:id    # Get single experience
PATCH  /api/candidate/profile/experiences/:id    # Update experience
DELETE /api/candidate/profile/experiences/:id    # Delete experience

# Education
GET    /api/candidate/profile/:id/education      # List education for candidate
POST   /api/candidate/profile/:candidateId/education    # Add education
GET    /api/candidate/profile/education/:id      # Get single education
PATCH  /api/candidate/profile/education/:id      # Update education
DELETE /api/candidate/profile/education/:id      # Delete education

# Skills
GET    /api/candidate/profile/:id/skills         # List skills for candidate
POST   /api/candidate/profile/:candidateId/skills       # Add skill
GET    /api/candidate/profile/skills/:id         # Get single skill
PATCH  /api/candidate/profile/skills/:id         # Update skill
DELETE /api/candidate/profile/skills/:id         # Delete skill

# Languages
GET    /api/candidate/profile/:id/languages      # List languages for candidate
POST   /api/candidate/profile/:candidateId/languages    # Add language
GET    /api/candidate/profile/languages/:id      # Get single language
PATCH  /api/candidate/profile/languages/:id      # Update language
DELETE /api/candidate/profile/languages/:id      # Delete language

# CV Management
GET    /api/candidate/profile/:id/cv             # List CVs for candidate
POST   /api/candidate/profile/:candidateId/cv   # Upload CV (multipart/form-data)
GET    /api/candidate/profile/cv/:id             # Get single CV with signed URL
DELETE /api/candidate/profile/cv/:id             # Delete CV

# Interests
GET    /api/candidate/profile/:id/interests      # List interests for candidate
POST   /api/candidate/profile/:candidateId/interests    # Add interest
GET    /api/candidate/profile/interests/:id      # Get single interest
DELETE /api/candidate/profile/interests/:id      # Delete interest
```

#### Companies
```
GET    /api/companies                            # List companies (public, paginated)
GET    /api/companies/:id                        # Get company by ID (public)

# Authenticated routes
POST   /api/companies                            # Create company
PATCH  /api/companies/:id                        # Update company
DELETE /api/companies/:id                        # Delete company

# Locations
POST   /api/companies/:id/locations              # Add location
GET    /api/companies/:id/locations              # Get locations
PATCH  /api/companies/:id/locations/:locId       # Update location
DELETE /api/companies/:id/locations/:locId       # Delete location

# Benefits
POST   /api/companies/:id/benefits               # Add benefit
GET    /api/companies/:id/benefits               # Get benefits
PATCH  /api/companies/:id/benefits/:benId        # Update benefit
DELETE /api/companies/:id/benefits/:benId        # Delete benefit

# Members
POST   /api/companies/:id/members                # Add member
GET    /api/companies/:id/members                # Get members
PATCH  /api/companies/:id/members/:memId         # Update member
DELETE /api/companies/:id/members/:memId         # Remove member

# Verification
POST   /api/companies/:id/verification           # Submit for verification (multipart)
GET    /api/companies/:id/verification           # Get verification status
GET    /api/companies/:id/verification/documents # Get company files with signed URLs

# Admin only
POST   /api/companies/:id/verification/submissions/:submissionId/review  # Review verification
```

#### Admin (requires `admin` role)
```
# Role Management
GET    /api/admin/roles                            # Get all roles with user count
GET    /api/admin/roles/:name/users                # Get users with specific role (paginated)

# User Management
GET    /api/admin/users                            # Get all users (paginated, with search)
GET    /api/admin/users?page=1&limit=10&search=... # Paginated user list with search
GET    /api/admin/users/:id/roles                  # Get specific user's roles
POST   /api/admin/users/:id/roles                  # Assign role to user (body: { roleName })
DELETE /api/admin/users/:id/roles                  # Remove role from user (body: { roleName })
```

**Admin Module Features:**
- View all system roles with user counts
- List users with pagination and search
- Assign/remove roles to/from users
- Filter users by specific role
- All endpoints require `admin` role
- Input validation with Zod schemas

### ⏳ Planned Endpoints

#### Company Reviews (Pending)
```
POST   /api/reviews/companies/:companyId     # Create company review
GET    /api/reviews/companies/:companyId     # Get company reviews
GET    /api/reviews/:id                      # Get review by ID
PATCH  /api/reviews/:id                      # Update review
DELETE /api/reviews/:id                      # Delete review
```

#### Notifications (Pending)
```
GET    /api/notifications                    # Get user notifications
GET    /api/notifications/:id                # Get notification by ID
PATCH  /api/notifications/:id/read           # Mark as read
PATCH  /api/notifications/read-all           # Mark all as read
DELETE /api/notifications/:id                # Delete notification
```

### Response Format

All responses are wrapped in a consistent envelope format by the response interceptor:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-04-11T22:00:00.000Z"
}
```

**Paginated List:**
```json
{
  "status": "success",
  "data": [...],
  "message": "...",
  "timestamp": "...",
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "status": "error",
  "data": {
    "success": false,
    "message": "Error details",
    "stack": "..."  // development only
  },
  "timestamp": "...",
  "message": "Error details"
}
```

---

## 🗃 Database Schema

### User Management
- **profiles** - Core user accounts (UUID, email, password, name, avatar)
- **roles** - System roles (admin, recruiter, candidate, moderator)
- **user_roles** - User-role assignments (many-to-many)

### Candidate Domain
- **candidate_profiles** - Extended candidate information
- **candidate_experiences** - Work history and experience
- **candidate_education** - Educational background
- **candidate_skills** - Skills with proficiency levels (beginner → expert)
- **candidate_languages** - Language skills with proficiency (basic → native)
- **candidate_cv_files** - Uploaded CV files metadata
- **candidate_interests** - Interest tags

### Company Domain
- **companies** - Company profiles and information
- **company_locations** - Office locations (multiple per company)
- **company_benefits** - Company benefits catalog
- **company_members** - Company-user relationships (owner, admin, recruiter)
- **company_verification_submissions** - Verification requests
- **company_verification_documents** - Verification documents

### Job Domain (Implemented)
- **job_categories** - Hierarchical job categories
- **vacancies** - Job postings with type, modality, level, status
- **vacancy_skills** - Required/optional skills per vacancy
- **vacancy_benefits** - Benefits offered per vacancy

### Application Domain (Implemented)
- **job_applications** - Applications with status tracking
- **saved_jobs** - User-bookmarked jobs
- **application_status_history** - Status change log
- **application_comments** - Application notes
- **candidate_company_follows** - Candidate following companies

### Resource & Forum Domain (Implemented)
- **resource_categories** - Categories for resources/articles
- **resources** - Articles and educational content
- **resource_ratings** - User ratings for resources
- **related_resources** - Resource relationships
- **forum_categories** - Forum discussion categories
- **forum_threads** - Discussion threads
- **forum_posts** - Posts within threads
- **forum_reports** - Reported content moderation

### Review, Notification (Pending)

### Key Enums

| Enum Type | Values |
|-----------|--------|
| **Vacancy Type** | full-time, part-time, contract, freelance, internship |
| **Vacancy Modality** | remote, hybrid, onsite |
| **Vacancy Level** | junior, mid, senior, lead, manager, director |
| **Vacancy Status** | draft, published, closed, archived |
| **Skill Level** | beginner, intermediate, advanced, expert |
| **Language Proficiency** | basic, intermediate, advanced, native |
| **Company Member Role** | owner, admin, recruiter |
| **Verification Status** | pending, approved, rejected |

---

## 📝 Development Guidelines

### Available Scripts

```bash
# Development
npm run dev              # Start server with auto-reload

# Database
npm run migration:run    # Run pending migrations
npm run migration:revert # Revert last migration
npm run migration:show   # Show migration status
npm run db:seed          # Run seed scripts
```

### Seed Users

The database comes with a default admin user that is created by running the seed script:

**Admin Credentials:**
- **Email:** `admin@trabajahoy.com`
- **Password:** `admin123`

To seed the database:

```bash
npm run db:seed
```

### Coding Standards

1. **File Naming:** lowercase with hyphens (`auth.middleware.js`)
2. **Module Files:** `<module>.controller.js`, `<module>.service.js`, etc.
3. **Database IDs:** Always UUID v4
4. **Timestamps:** Always include `created_at`, `updated_at`
5. **Error Handling:** Use centralized error middleware
6. **Validation:** Always validate inputs with Zod schemas
7. **Security:** Never expose passwords or sensitive data
8. **Responses:** Use consistent `{ success, data, message }` format

### Implementation Order

When adding new features:

1. Database migration (if needed)
2. TypeORM model/entity
3. DTOs (Zod validation schemas)
4. Repository (data access)
5. Service (business logic)
6. Controller (request/response)
7. Routes (with middleware)
8. Module index (wire dependencies)
9. Register in `main.js`

### Detailed Guidelines

- **.github/CONTRIBUTING.md** - Contribution guidelines
- **.github/PULL_REQUEST_TEMPLATE.md** - PR template

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create a branch** from `develop` (or `main`)
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** following project conventions
4. **Test** your changes manually
5. **Commit** using conventional commits
   ```bash
   git commit -m "feat(module): description"
   ```
6. **Push** to your fork
   ```bash
   git push origin feat/your-feature-name
   ```
7. **Open a Pull Request** and fill out the template

For detailed guidelines, see [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)

---

## 🧪 Testing

> ⚠️ Testing framework is not yet configured.

When testing is added, it will likely use:
- **Jest** or **Vitest** for unit/integration tests
- **Supertest** for API testing
- Test database for integration tests

Run tests with:
```bash
npm test  # To be configured
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS origins
- [ ] Set up environment variables on server
- [ ] Run migrations: `npm run migration:run`
- [ ] Set up process manager (PM2, systemd, etc.)
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure backups for database
- [ ] Rate limiting and security headers

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-strong-password
DB_NAME=trabajahoy
DB_SSL=true

JWT_SECRET=your-very-strong-secret-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=another-very-strong-secret-key
JWT_REFRESH_EXPIRES_IN=7d
```

### Deployment Options

- **Railway** - Easy deployment with managed PostgreSQL
- **Render** - Simple deployment with auto-scaling
- **AWS/GCP/Azure** - Full control with infrastructure as code
- **DigitalOcean** - Affordable VPS hosting
- **Heroku** - Platform as a service

---

## 🔧 Troubleshooting

### Common Issues

**Cannot connect to database:**
```bash
# Check if PostgreSQL is running
# Windows:
Get-Service postgresql*

# Mac/Linux:
sudo systemctl status postgresql

# Verify .env variables match your database setup
# Test connection:
psql -U postgres -h localhost -p 5432
```

**Migration fails:**
```bash
# Check migration status
npm run migration:show

# Check database connection in .env
# Ensure UUID extension is enabled:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001

# Or kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

**JWT errors:**
- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
- Use different secrets for development and production
- Secrets should be at least 32 characters long

**Module not found errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that import paths use `.js` extension (ES modules requirement)

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Zod Documentation](https://zod.dev/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed with ❤️ by the TrabajaHoy Team

---

## 📞 Support

For questions or issues:
- Open an [Issue](https://github.com/your-username/trabajahoy-backend/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with Node.js & Express | PostgreSQL | TypeORM

</div>
