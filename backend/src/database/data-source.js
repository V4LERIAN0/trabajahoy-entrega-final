import { DataSource } from "typeorm";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically load all migration files
const migrationsDir = path.join(__dirname, "migrations");
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".js"))
  .sort();

export async function loadEntities() {
  const modulesDir = path.join(__dirname, "..", "modules");
  const entities = [];

  const moduleDirs = fs.readdirSync(modulesDir).filter((dir) => {
    const fullPath = path.join(modulesDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const moduleDir of moduleDirs) {
    const modelsDir = path.join(modulesDir, moduleDir, "models");

    if (fs.existsSync(modelsDir)) {
      const modelFiles = fs
        .readdirSync(modelsDir)
        .filter((file) => file.endsWith(".model.js"));

      for (const file of modelFiles) {
        const modelPath = path.join(modelsDir, file);
        const modelUrl = pathToFileURL(modelPath).href;

        try {
          const module = await import(modelUrl);
          const exports = module.default ? [module.default] : [];
          const namedExports = Object.values(module).filter(
            (exp) =>
              exp && typeof exp === "object" && exp.name && exp.tableName,
          );
          entities.push(...exports, ...namedExports);
        } catch (err) {
          console.error(`Failed to load entity from ${modelPath}:`, err);
        }
      }
    }
  }

  return entities.filter((e) => e !== undefined);
}

// Synchronous entity loading for DataSource initialization
function loadEntitiesSync() {
  const modulesDir = path.join(__dirname, "..", "modules");
  const entities = [];

  const moduleDirs = fs.readdirSync(modulesDir).filter((dir) => {
    const fullPath = path.join(modulesDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  moduleDirs.forEach((moduleDir) => {
    const modelsDir = path.join(modulesDir, moduleDir, "models");

    if (fs.existsSync(modelsDir)) {
      fs.readdirSync(modelsDir).filter((file) => file.endsWith(".model.js"));
    }
  });

  return entities;
}

// Entity imports - explicit imports for reliability
import { Profile } from "../modules/auth/models/profile.model.js";
import { Role } from "../modules/auth/models/role.model.js";
import { UserRole } from "../modules/auth/models/user-role.model.js";

import { ApplicationComment } from "../modules/application/models/application-comment.model.js";
import { ApplicationStatusHistory } from "../modules/application/models/application-status-history.model.js";
import { CandidateCompanyFollow } from "../modules/application/models/candidate-company-follow.model.js";
import { JobApplication } from "../modules/application/models/job-application.model.js";
import { SavedJob } from "../modules/application/models/saved-job.model.js";

import { CandidateProfile } from "../modules/candidate/models/candidate-profile.model.js";
import { CandidateExperience } from "../modules/candidate/models/candidate-experience.model.js";
import { CandidateEducation } from "../modules/candidate/models/candidate-education.model.js";
import { CandidateSkill } from "../modules/candidate/models/candidate-skill.model.js";
import { CandidateLanguage } from "../modules/candidate/models/candidate-language.model.js";
import { CandidateCvFile } from "../modules/candidate/models/candidate-cv-file.model.js";
import { CandidateInterest } from "../modules/candidate/models/candidate-interest.model.js";

import { Company } from "../modules/company/models/company.model.js";
import { CompanyLocation } from "../modules/company/models/company-location.model.js";
import { CompanyBenefit } from "../modules/company/models/company-benefit.model.js";
import { CompanyMember } from "../modules/company/models/company-member.model.js";
import { CompanyVerificationSubmission } from "../modules/company/models/company-verification-submission.model.js";
import { CompanyVerificationDocument } from "../modules/company/models/company-verification-document.model.js";

import { ForumCategory } from "../modules/forum/models/forum-category.model.js";
import { ForumThread } from "../modules/forum/models/forum-thread.model.js";
import { ForumPost } from "../modules/forum/models/forum-post.model.js";
import { ForumReport } from "../modules/forum/models/forum-report.model.js";

import { ResourceCategory } from "../modules/resource/models/resource-category.model.js";
import { Resource } from "../modules/resource/models/resource.model.js";
import { ResourceRating } from "../modules/resource/models/resource-rating.model.js";
import { ResourceRelated } from "../modules/resource/models/resource-related.model.js";

import { JobCategory } from "../modules/vacancy/models/job-category.model.js";
import { Vacancy } from "../modules/vacancy/models/vacancy.model.js";
import { VacancySkill } from "../modules/vacancy/models/vacancy-skill.model.js";
import { VacancyBenefit } from "../modules/vacancy/models/vacancy-benefit.model.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  // logging: process.env.NODE_ENV === 'development',
  entities: [
    Profile,
    Role,
    UserRole,
    JobApplication,
    ApplicationStatusHistory,
    ApplicationComment,
    SavedJob,
    CandidateCompanyFollow,
    CandidateProfile,
    CandidateExperience,
    CandidateEducation,
    CandidateSkill,
    CandidateLanguage,
    CandidateCvFile,
    CandidateInterest,
    Company,
    CompanyLocation,
    CompanyBenefit,
    CompanyMember,
    CompanyVerificationSubmission,
    CompanyVerificationDocument,
    ForumCategory,
    ForumThread,
    ForumPost,
    ForumReport,
    ResourceCategory,
    Resource,
    ResourceRating,
    ResourceRelated,
    JobCategory,
    Vacancy,
    VacancySkill,
    VacancyBenefit,
  ],
  migrations: migrationFiles.map(
    (file) => pathToFileURL(path.join(migrationsDir, file)).href,
  ),
  migrationsTableName: "_migrations",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
