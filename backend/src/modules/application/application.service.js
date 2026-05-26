import { ApplicationRepository } from "./application.repository.js";

const ALLOWED_APPLICATION_STATUS_TRANSITIONS = {
  pending: ["reviewed", "interview", "rejected"],
  reviewed: ["interview", "rejected"],
  interview: ["accepted", "rejected"],
  accepted: ["rejected"],
  rejected: [],
};

export class ApplicationService {
  constructor() {
    this.applicationRepository = new ApplicationRepository();
  }

  createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  isAdmin(userRoles = []) {
    return userRoles.includes("admin");
  }

  isRecruiter(userRoles = []) {
    return (
      userRoles.includes("recruiter") || userRoles.includes("company_admin")
    );
  }

  isCandidate(userRoles = []) {
    return userRoles.includes("candidate");
  }

  ensureValidStatusTransition(currentStatus, nextStatus) {
    if (currentStatus === nextStatus) {
      return;
    }

    const allowedNext =
      ALLOWED_APPLICATION_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(nextStatus)) {
      throw this.createHttpError(
        409,
        `Invalid application status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  async ensureManagerPermission(companyId, userId, userRoles = []) {
    if (this.isAdmin(userRoles)) {
      return;
    }

    if (!this.isRecruiter(userRoles)) {
      throw this.createHttpError(
        403,
        "You do not have permission to perform this action",
      );
    }

    const managedCompanyIds =
      await this.applicationRepository.findManagedCompanyIds(userId);
    if (!managedCompanyIds.includes(companyId)) {
      throw this.createHttpError(
        403,
        "You do not have permission to perform this action",
      );
    }
  }

  async ensureCanAccessApplication(application, userId, userRoles = []) {
    if (this.isAdmin(userRoles)) {
      return;
    }

    if (application.userId === userId) {
      return;
    }

    const companyId = application.vacancy?.companyId;
    if (!companyId) {
      throw this.createHttpError(404, "Application not found");
    }

    await this.ensureManagerPermission(companyId, userId, userRoles);
  }

  async getApplicationOrThrow(applicationId) {
    const application =
      await this.applicationRepository.findApplicationById(applicationId);

    if (!application) {
      throw this.createHttpError(404, "Application not found");
    }

    return application;
  }

  // Applications
  async applyToJob(userId, userRoles = [], data) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can apply to jobs");
    }

    const vacancy = await this.applicationRepository.findPublishedVacancyById(
      data.vacancyId,
    );
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }

    const existingApplication =
      await this.applicationRepository.findApplicationByUserAndVacancy(
        userId,
        data.vacancyId,
      );

    if (existingApplication) {
      throw this.createHttpError(
        409,
        "You have already applied to this vacancy",
      );
    }

    const application = await this.applicationRepository.createApplication({
      ...data,
      userId,
      status: "pending",
    });

    await this.applicationRepository.addStatusHistory(application.id, {
      fromStatus: null,
      toStatus: "pending",
      changedBy: userId,
      notes: "Application submitted",
    });

    return await this.applicationRepository.findApplicationWithDetailsById(
      application.id,
    );
  }

  async getApplications(userId, userRoles = [], filters = {}, pagination = {}) {
    if (this.isAdmin(userRoles)) {
      return await this.applicationRepository.findApplications(
        filters,
        pagination,
      );
    }

    if (this.isRecruiter(userRoles)) {
      const managedCompanyIds =
        await this.applicationRepository.findManagedCompanyIds(userId);

      if (managedCompanyIds.length === 0) {
        return {
          data: [],
          total: 0,
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          totalPages: 0,
        };
      }

      if (filters.companyId && !managedCompanyIds.includes(filters.companyId)) {
        throw this.createHttpError(
          403,
          "You do not have permission to access this company applications",
        );
      }

      const companyIds = filters.companyId
        ? [filters.companyId]
        : managedCompanyIds;

      return await this.applicationRepository.findApplicationsForManagement(
        companyIds,
        filters,
        pagination,
      );
    }

    if (this.isCandidate(userRoles)) {
      return await this.applicationRepository.findApplicationsForCandidate(
        userId,
        filters,
        pagination,
      );
    }

    throw this.createHttpError(
      403,
      "You do not have permission to access applications",
    );
  }

  async getApplicationById(applicationId, userId, userRoles = []) {
    const application = await this.getApplicationOrThrow(applicationId);
    await this.ensureCanAccessApplication(application, userId, userRoles);

    return await this.applicationRepository.findApplicationWithDetailsById(
      applicationId,
    );
  }

  async updateApplication(applicationId, userId, userRoles = [], data) {
    const application = await this.getApplicationOrThrow(applicationId);

    if (!this.isCandidate(userRoles) || application.userId !== userId) {
      throw this.createHttpError(
        403,
        "Only the candidate owner can update the application",
      );
    }

    if (application.status !== "pending") {
      throw this.createHttpError(
        409,
        "Application can only be updated while status is pending",
      );
    }

    return await this.applicationRepository.updateApplication(
      applicationId,
      data,
    );
  }

  // Status history
  async changeStatus(applicationId, userId, userRoles = [], data) {
    const application = await this.getApplicationOrThrow(applicationId);

    if (!this.isAdmin(userRoles) && !this.isRecruiter(userRoles)) {
      throw this.createHttpError(
        403,
        "Only recruiter, company_admin, or admin can change application status",
      );
    }

    await this.ensureManagerPermission(
      application.vacancy.companyId,
      userId,
      userRoles,
    );

    this.ensureValidStatusTransition(application.status, data.toStatus);

    if (application.status === data.toStatus) {
      return application;
    }

    const updatedApplication =
      await this.applicationRepository.updateApplication(applicationId, {
        status: data.toStatus,
      });

    await this.applicationRepository.addStatusHistory(applicationId, {
      fromStatus: application.status,
      toStatus: data.toStatus,
      changedBy: userId,
      notes: data.notes,
    });

    return updatedApplication;
  }

  async scheduleInterview(applicationId, userId, userRoles = [], data) {
    const application = await this.getApplicationOrThrow(applicationId);

    if (!this.isAdmin(userRoles) && !this.isRecruiter(userRoles)) {
      throw this.createHttpError(
        403,
        "Only recruiter, company_admin, or admin can schedule interviews",
      );
    }

    await this.ensureManagerPermission(
      application.vacancy.companyId,
      userId,
      userRoles,
    );

    // Move to "interview" status if not already there
    const currentStatus = application.status;
    const updateData = {
      interviewScheduledAt: new Date(data.scheduledAt),
      interviewLocation: data.location ?? null,
      interviewNotes: data.notes ?? null,
    };

    if (currentStatus !== "interview") {
      this.ensureValidStatusTransition(currentStatus, "interview");
      updateData.status = "interview";
    }

    const updated = await this.applicationRepository.updateApplication(
      applicationId,
      updateData,
    );

    if (currentStatus !== "interview") {
      await this.applicationRepository.addStatusHistory(applicationId, {
        fromStatus: currentStatus,
        toStatus: "interview",
        changedBy: userId,
        notes: data.notes ?? "Interview scheduled",
      });
    }

    return updated;
  }

  async getApplicantsByVacancy(
    vacancyId,
    userId,
    userRoles = [],
    filters = {},
    pagination = {},
  ) {
    if (!this.isAdmin(userRoles) && !this.isRecruiter(userRoles)) {
      throw this.createHttpError(
        403,
        "Only recruiters, company_admins, or admins can view applicants",
      );
    }

    if (this.isRecruiter(userRoles)) {
      const vacancy =
        await this.applicationRepository.findVacancyById(vacancyId);
      if (!vacancy) {
        throw this.createHttpError(404, "Vacancy not found");
      }
      await this.ensureManagerPermission(
        vacancy.companyId,
        userId,
        userRoles,
      );
    }

    return await this.applicationRepository.findApplicationsForManagement(
      null,
      { ...filters, vacancyId },
      pagination,
    );
  }

  async getStatusHistory(
    applicationId,
    userId,
    userRoles = [],
    pagination = {},
  ) {
    const application = await this.getApplicationOrThrow(applicationId);
    await this.ensureCanAccessApplication(application, userId, userRoles);

    return await this.applicationRepository.findStatusHistoryByApplicationId(
      applicationId,
      pagination,
    );
  }

  // Comments
  async addComment(applicationId, userId, userRoles = [], data) {
    const application = await this.getApplicationOrThrow(applicationId);
    await this.ensureCanAccessApplication(application, userId, userRoles);

    const comment = await this.applicationRepository.addComment(
      applicationId,
      userId,
      data,
    );

    return await this.applicationRepository.findCommentById(comment.id);
  }

  async getComments(applicationId, userId, userRoles = [], pagination = {}) {
    const application = await this.getApplicationOrThrow(applicationId);
    await this.ensureCanAccessApplication(application, userId, userRoles);

    return await this.applicationRepository.findCommentsByApplicationId(
      applicationId,
      pagination,
    );
  }

  async getCommentById(commentId, userId, userRoles = []) {
    const comment = await this.applicationRepository.findCommentById(commentId);
    if (!comment) {
      throw this.createHttpError(404, "Application comment not found");
    }

    await this.ensureCanAccessApplication(
      comment.application,
      userId,
      userRoles,
    );
    return comment;
  }

  async updateComment(commentId, userId, userRoles = [], data) {
    const comment = await this.applicationRepository.findCommentById(commentId);
    if (!comment) {
      throw this.createHttpError(404, "Application comment not found");
    }

    // Always validate access to the parent application scope first.
    await this.ensureCanAccessApplication(
      comment.application,
      userId,
      userRoles,
    );

    const canEditOwnComment = comment.userId === userId;
    if (!canEditOwnComment && !this.isAdmin(userRoles)) {
      if (!this.isRecruiter(userRoles)) {
        throw this.createHttpError(
          403,
          "You do not have permission to update this comment",
        );
      }

      await this.ensureManagerPermission(
        comment.application.vacancy.companyId,
        userId,
        userRoles,
      );
    }

    return await this.applicationRepository.updateComment(commentId, data);
  }

  async deleteComment(commentId, userId, userRoles = []) {
    const comment = await this.applicationRepository.findCommentById(commentId);
    if (!comment) {
      throw this.createHttpError(404, "Application comment not found");
    }

    // Always validate access to the parent application scope first.
    await this.ensureCanAccessApplication(
      comment.application,
      userId,
      userRoles,
    );

    const canDeleteOwnComment = comment.userId === userId;
    if (!canDeleteOwnComment && !this.isAdmin(userRoles)) {
      if (!this.isRecruiter(userRoles)) {
        throw this.createHttpError(
          403,
          "You do not have permission to delete this comment",
        );
      }

      await this.ensureManagerPermission(
        comment.application.vacancy.companyId,
        userId,
        userRoles,
      );
    }

    await this.applicationRepository.deleteComment(commentId);
    return true;
  }

  // Saved jobs
  async saveJob(userId, userRoles = [], data) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can save jobs");
    }

    const vacancy = await this.applicationRepository.findPublishedVacancyById(
      data.vacancyId,
    );
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }

    const existingSavedJob =
      await this.applicationRepository.findSavedJobByUserAndVacancy(
        userId,
        data.vacancyId,
      );

    if (existingSavedJob) {
      throw this.createHttpError(409, "Job already saved");
    }

    const savedJob = await this.applicationRepository.createSavedJob({
      userId,
      vacancyId: data.vacancyId,
    });

    return await this.applicationRepository.findSavedJobById(savedJob.id);
  }

  async getSavedJobs(userId, userRoles = [], pagination = {}) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can list saved jobs");
    }

    return await this.applicationRepository.findSavedJobsByUser(
      userId,
      pagination,
    );
  }

  async deleteSavedJob(savedJobId, userId, userRoles = []) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can delete saved jobs");
    }

    const savedJob =
      await this.applicationRepository.findSavedJobById(savedJobId);
    if (!savedJob) {
      throw this.createHttpError(404, "Saved job not found");
    }

    if (savedJob.userId !== userId) {
      throw this.createHttpError(
        403,
        "You do not have permission to delete this saved job",
      );
    }

    await this.applicationRepository.deleteSavedJob(savedJobId);
    return true;
  }

  // Company follows
  async followCompany(userId, userRoles = [], data) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can follow companies");
    }

    const company = await this.applicationRepository.findCompanyById(
      data.companyId,
    );
    if (!company) {
      throw this.createHttpError(404, "Company not found");
    }

    const existingFollow =
      await this.applicationRepository.findFollowByUserAndCompany(
        userId,
        data.companyId,
      );

    if (existingFollow) {
      throw this.createHttpError(409, "Company already followed");
    }

    const follow = await this.applicationRepository.createFollow({
      userId,
      companyId: data.companyId,
    });

    return await this.applicationRepository.findFollowById(follow.id);
  }

  async getFollows(userId, userRoles = [], pagination = {}) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(
        403,
        "Only candidates can list followed companies",
      );
    }

    return await this.applicationRepository.findFollowsByUser(
      userId,
      pagination,
    );
  }

  async unfollowCompany(followId, userId, userRoles = []) {
    if (!this.isCandidate(userRoles)) {
      throw this.createHttpError(403, "Only candidates can unfollow companies");
    }

    const follow = await this.applicationRepository.findFollowById(followId);
    if (!follow) {
      throw this.createHttpError(404, "Company follow not found");
    }

    if (follow.userId !== userId) {
      throw this.createHttpError(
        403,
        "You do not have permission to delete this follow",
      );
    }

    await this.applicationRepository.deleteFollow(followId);
    return true;
  }
}
