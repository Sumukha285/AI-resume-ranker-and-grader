/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  gpa: string;
  graduationDate: string;
  coursework: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  role: string;
  bullets: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Extracurricular {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Skills {
  languages: string;
  frameworks: string;
  tools: string;
}

export interface ResumeData {
  contact: ContactInfo;
  education: Education[];
  projects: Project[];
  experience: Experience[];
  extracurriculars: Extracurricular[];
  skills: Skills;
  achievements: string[];
}

export interface GradeItem {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestions: string[];
}

export interface GradeResult {
  overallScore: number;
  summary: string;
  dimensions: {
    formatting: GradeItem;
    contentStrength: GradeItem;
    actionVerbs: GradeItem;
    relevance: GradeItem;
    extracurriculars: GradeItem;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  actionItems: string[];
  starBulletOptimizations: Array<{
    original: string;
    suggested: string;
    explanation: string;
  }>;
}

export interface OptimizeBulletResponse {
  suggestions: Array<{
    bullet: string;
    method: "STAR" | "CAR" | "Action-Oriented";
    reasoning: string;
  }>;
}

export type TemplateType = "minimalist" | "technical" | "academic";
