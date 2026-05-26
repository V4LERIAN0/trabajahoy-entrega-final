/**
 * @swagger
 * tags:
 *   name: Candidate
 *   description: Candidate profile management (requires candidate role)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCandidateProfile:
 *       type: object
 *       properties:
 *         headline:
 *           type: string
 *           maxLength: 200
 *           example: Full Stack Developer
 *         bio:
 *           type: string
 *           example: Experienced developer with 5 years in web development
 *         location:
 *           type: string
 *           maxLength: 200
 *           example: Madrid, Spain
 *         website:
 *           type: string
 *           maxLength: 500
 *           example: https://myportfolio.com
 *         availability:
 *           type: string
 *           maxLength: 50
 *           example: available
 *     CandidateProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         bio:
 *           type: string
 *           nullable: true
 *         headline:
 *           type: string
 *           nullable: true
 *         website:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         availability:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ExperienceRequest:
 *       type: object
 *       required:
 *         - companyName
 *         - role
 *         - startDate
 *       properties:
 *         companyName:
 *           type: string
 *           maxLength: 200
 *           example: Tech Corp
 *         role:
 *           type: string
 *           maxLength: 200
 *           example: Senior Developer
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2023-01-15
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2024-06-30
 *         description:
 *           type: string
 *           maxLength: 2000
 *           nullable: true
 *         isCurrent:
 *           type: boolean
 *           default: false
 *         location:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *     EducationRequest:
 *       type: object
 *       required:
 *         - institution
 *         - degree
 *         - startDate
 *       properties:
 *         institution:
 *           type: string
 *           maxLength: 200
 *           example: MIT
 *         degree:
 *           type: string
 *           maxLength: 100
 *           example: Bachelor of Science
 *         fieldOfStudy:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *           example: Computer Science
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2019-09-01
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2023-06-01
 *         grade:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *         description:
 *           type: string
 *           maxLength: 2000
 *           nullable: true
 *     SkillRequest:
 *       type: object
 *       required:
 *         - skillName
 *         - level
 *       properties:
 *         skillName:
 *           type: string
 *           maxLength: 100
 *           example: JavaScript
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *           example: expert
 *         yearsOfExperience:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *     LanguageRequest:
 *       type: object
 *       required:
 *         - languageName
 *         - proficiency
 *       properties:
 *         languageName:
 *           type: string
 *           maxLength: 100
 *           example: English
 *         proficiency:
 *           type: string
 *           enum: [basic, intermediate, advanced, native]
 *           example: native
 *     InterestRequest:
 *       type: object
 *       required:
 *         - interest
 *       properties:
 *         interest:
 *           type: string
 *           maxLength: 100
 *           example: Open Source
 */

/* ==================== PROFILE ==================== */

/**
 * @swagger
 * /api/candidate/profile:
 *   post:
 *     summary: Create candidate profile
 *     description: Creates a new candidate profile for the authenticated user. Only one profile per user allowed.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateProfile'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CandidateProfile'
 *                 message:
 *                   type: string
 *                   example: Candidate profile created successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Profile already exists
 */

/**
 * @swagger
 * /api/candidate/profile/{id}:
 *   get:
 *     summary: Get candidate profile by ID
 *     description: Retrieves a candidate profile with all related data (experiences, education, skills, languages, CVs, interests).
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/CandidateProfile'
 *                     - type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                         experiences:
 *                           type: array
 *                           items:
 *                             type: object
 *                         education:
 *                           type: array
 *                           items:
 *                             type: object
 *                         skills:
 *                           type: array
 *                           items:
 *                             type: object
 *                         languages:
 *                           type: array
 *                           items:
 *                             type: object
 *                         cvs:
 *                           type: array
 *                           items:
 *                             type: object
 *                         interests:
 *                           type: array
 *                           items:
 *                             type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Profile not found
 *   patch:
 *     summary: Update candidate profile
 *     description: Updates candidate profile fields. All fields are optional.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Profile not found
 *   delete:
 *     summary: Delete candidate profile
 *     description: Deletes a candidate profile and all related data.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 */

/* ==================== EXPERIENCES ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/experiences:
 *   post:
 *     summary: Add work experience
 *     description: Adds a new work experience entry to a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceRequest'
 *     responses:
 *       201:
 *         description: Experience added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/experiences:
 *   get:
 *     summary: List experiences by candidate
 *     description: Retrieves all work experiences for a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Experiences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/candidate/profile/experiences/{id}:
 *   get:
 *     summary: Get single experience
 *     description: Retrieves a single work experience by its ID.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Experience ID
 *     responses:
 *       200:
 *         description: Experience retrieved successfully
 *       404:
 *         description: Experience not found
 *   patch:
 *     summary: Update experience
 *     description: Updates a work experience entry. All fields are optional.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Experience ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceRequest'
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Experience not found
 *   delete:
 *     summary: Delete experience
 *     description: Deletes a work experience entry.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Experience ID
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Experience not found
 */

/* ==================== EDUCATION ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/education:
 *   post:
 *     summary: Add education
 *     description: Adds a new education entry to a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationRequest'
 *     responses:
 *       201:
 *         description: Education added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/education:
 *   get:
 *     summary: List education by candidate
 *     description: Retrieves all education entries for a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Education entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/candidate/profile/education/{id}:
 *   get:
 *     summary: Get single education
 *     description: Retrieves a single education entry by its ID.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Education ID
 *     responses:
 *       200:
 *         description: Education retrieved successfully
 *       404:
 *         description: Education not found
 *   patch:
 *     summary: Update education
 *     description: Updates an education entry. All fields are optional.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Education ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationRequest'
 *     responses:
 *       200:
 *         description: Education updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Education not found
 *   delete:
 *     summary: Delete education
 *     description: Deletes an education entry.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Education ID
 *     responses:
 *       200:
 *         description: Education deleted successfully
 *       404:
 *         description: Education not found
 */

/* ==================== SKILLS ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/skills:
 *   post:
 *     summary: Add skill
 *     description: Adds a new skill to a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SkillRequest'
 *     responses:
 *       201:
 *         description: Skill added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/skills:
 *   get:
 *     summary: List skills by candidate
 *     description: Retrieves all skills for a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 */

/**
 * @swagger
 * /api/candidate/profile/skills/{id}:
 *   get:
 *     summary: Get single skill
 *     description: Retrieves a single skill by its ID.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill retrieved successfully
 *       404:
 *         description: Skill not found
 *   patch:
 *     summary: Update skill
 *     description: Updates a skill. All fields are optional.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SkillRequest'
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Skill not found
 *   delete:
 *     summary: Delete skill
 *     description: Deletes a skill.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 */

/* ==================== LANGUAGES ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/languages:
 *   post:
 *     summary: Add language
 *     description: Adds a new language to a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LanguageRequest'
 *     responses:
 *       201:
 *         description: Language added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/languages:
 *   get:
 *     summary: List languages by candidate
 *     description: Retrieves all languages for a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Languages retrieved successfully
 */

/**
 * @swagger
 * /api/candidate/profile/languages/{id}:
 *   get:
 *     summary: Get single language
 *     description: Retrieves a single language by its ID.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Language retrieved successfully
 *       404:
 *         description: Language not found
 *   patch:
 *     summary: Update language
 *     description: Updates a language. All fields are optional.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Language ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LanguageRequest'
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Language not found
 *   delete:
 *     summary: Delete language
 *     description: Deletes a language.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *       404:
 *         description: Language not found
 */

/* ==================== CV ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/cv:
 *   post:
 *     summary: Upload CV
 *     description: Uploads a CV file to Supabase Storage and saves metadata.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CV file (PDF, DOC, DOCX)
 *     responses:
 *       201:
 *         description: CV uploaded successfully
 *       400:
 *         description: No file provided
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/cv:
 *   get:
 *     summary: List CVs by candidate
 *     description: Retrieves all CVs for a candidate profile with signed URLs.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: CVs retrieved successfully
 */

/**
 * @swagger
 * /api/candidate/profile/cv/{id}:
 *   get:
 *     summary: Get single CV
 *     description: Retrieves a single CV with signed URL.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: CV ID
 *     responses:
 *       200:
 *         description: CV retrieved successfully
 *       404:
 *         description: CV not found
 *   delete:
 *     summary: Delete CV
 *     description: Deletes a CV file from storage and database.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: CV ID
 *     responses:
 *       200:
 *         description: CV deleted successfully
 *       404:
 *         description: CV not found
 */

/* ==================== INTERESTS ==================== */

/**
 * @swagger
 * /api/candidate/profile/{candidateId}/interests:
 *   post:
 *     summary: Add interest
 *     description: Adds a new interest to a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestRequest'
 *     responses:
 *       201:
 *         description: Interest added successfully
 *       404:
 *         description: Candidate profile not found
 *
 * /api/candidate/profile/{id}/interests:
 *   get:
 *     summary: List interests by candidate
 *     description: Retrieves all interests for a candidate profile.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate profile ID
 *     responses:
 *       200:
 *         description: Interests retrieved successfully
 */

/**
 * @swagger
 * /api/candidate/profile/interests/{id}:
 *   get:
 *     summary: Get single interest
 *     description: Retrieves a single interest by its ID.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Interest ID
 *     responses:
 *       200:
 *         description: Interest retrieved successfully
 *       404:
 *         description: Interest not found
 *   delete:
 *     summary: Delete interest
 *     description: Deletes an interest.
 *     tags: [Candidate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Interest ID
 *     responses:
 *       200:
 *         description: Interest deleted successfully
 *       404:
 *         description: Interest not found
 */
