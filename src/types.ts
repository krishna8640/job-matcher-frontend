/**
 * Type definitions for AI Job Matcher application
 */

// Job result interface representing a job posting match
export interface JobResult {
    job_id: number;
    title: string;
    company: string;
    location: string;
    similarity_score: number;
    job_type: string;
    salary_range: string;
    description: string;
    description_preview: string;
    url: string;
  }