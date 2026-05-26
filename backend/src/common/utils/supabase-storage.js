import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../config/constants.js';

/**
 * Supabase Storage Service
 * Handles file uploads, deletions, and signed URL generation
 */
class SupabaseStorage {
  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  /**
   * Upload a file to a Supabase bucket
   * @param {string} bucket - Bucket name (e.g., 'CVs', 'CompanyDocs')
   * @param {string} path - File path within the bucket (e.g., 'candidateId/filename.pdf')
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<string>} Full file path in the bucket
   */
  async uploadFile(bucket, path, fileBuffer, contentType) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    return data.path;
  }

  /**
   * Delete a file from a Supabase bucket
   * @param {string} bucket - Bucket name
   * @param {string} path - File path within the bucket
   * @returns {Promise<void>}
   */
  async deleteFile(bucket, path) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file from Supabase: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for accessing a file
   * @param {string} bucket - Bucket name
   * @param {string} path - File path within the bucket
   * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns {Promise<string>} Signed URL
   */
  async generateSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Upload a CV file for a candidate
   * @param {string} candidateId - Candidate UUID
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @returns {Promise<Object>} { name, filePath }
   */
  async uploadCV(candidateId, fileBuffer, fileName) {
    const timestamp = Date.now();
    const filePath = `${candidateId}/${timestamp}-${fileName}`;
    
    await this.uploadFile('CVs', filePath, fileBuffer, 'application/pdf');
    
    return {
      name: fileName,
      filePath,
    };
  }

  /**
   * Get signed URLs for all CVs of a candidate
   * @param {string} candidateId - Candidate UUID
   * @param {Array} cvFiles - Array of CV file records from DB
   * @returns {Promise<Array>} Array of { name, file: signedUrl }
   */
  async getCVs(candidateId, cvFiles) {
    const signedUrls = await Promise.all(
      cvFiles.map(async (cv) => {
        const signedUrl = await this.generateSignedUrl('CVs', cv.filePath);
        return {
          name: cv.name,
          file: signedUrl,
        };
      })
    );

    return signedUrls;
  }

  /**
   * Delete a CV file from Supabase
   * @param {string} filePath - File path in the bucket
   * @returns {Promise<void>}
   */
  async deleteCV(filePath) {
    await this.deleteFile('CVs', filePath);
  }

  /**
   * Upload a company verification document
   * @param {string} companyId - Company UUID
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @returns {Promise<Object>} { name, filePath }
   */
  async uploadCompanyDoc(companyId, fileBuffer, fileName) {
    const timestamp = Date.now();
    const filePath = `${companyId}/${timestamp}-${fileName}`;
    
    await this.uploadFile('CompanyDocs', filePath, fileBuffer, 'application/pdf');
    
    return {
      name: fileName,
      filePath,
    };
  }

  /**
   * Get signed URLs for all company verification documents
   * @param {string} companyId - Company UUID
   * @param {Array} documents - Array of document records from DB
   * @returns {Promise<Array>} Array of { name, file: signedUrl }
   */
  async getCompanyDocs(companyId, documents) {
    const signedUrls = await Promise.all(
      documents.map(async (doc) => {
        const signedUrl = await this.generateSignedUrl('CompanyDocs', doc.fileUrl);
        return {
          name: doc.documentType,
          file: signedUrl,
        };
      })
    );

    return signedUrls;
  }
}

export const supabaseStorage = new SupabaseStorage();
export default supabaseStorage;
