/**
 * KV CMS Type Definitions
 * Shared types for bio, projects, and settings data
 */

export interface Bio {
  name: string;
  title: string;
  intro: string;
  email: string;
  phone?: string;
  github: string;
  linkedin: string;
  twitter?: string;
  photo: string;
  about: string;
  targetRoles?: string[];
  availability?: string;
  yearsOfExperience?: number;
  keyAchievements?: string[];
  skills: {
    expert?: string[];
    advanced?: string[];
    intermediate?: string[];
    languages?: string[];
    frontend?: {
      expert?: string[];
      advanced?: string[];
    };
    backend?: {
      expert?: string[];
      advanced?: string[];
    };
    databases?: {
      advanced?: string[];
    };
    devops?: {
      advanced?: string[];
    };
    aiml?: {
      intermediate?: string[];
    };
    mobile?: {
      intermediate?: string[];
    };
    tools?: {
      proficient?: string[];
    } | string[];
    methodologies?: {
      expert?: string[];
      advanced?: string[];
    } | string[];
  };
  stats?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current?: boolean;
  location?: string;
  country?: string;
  description?: string;
  achievements: string[];
  technologies: string[];
  type: 'fulltime' | 'parttime' | 'contract' | 'freelance' | 'intern';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location?: string;
  country?: string;
  description?: string;
  grade?: string;
  eqfLevel?: string;
  credits?: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'methodology' | 'database' | 'devops';
  proficiency: 'expert' | 'advanced' | 'intermediate' | 'beginner';
  yearsOfExperience?: number;
  endorsements?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  keyMetrics?: string[];
  technologies: string[];
  stack?: string[];
  roleAndImpact?: string;
  link: string;
  featured: boolean;
  status?: 'active' | 'completed' | 'archived';
}

export interface Settings {
  theme: 'light' | 'dark';
  defaultMode: 'classic' | 'fantasy' | 'portal';
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  contactEmail: string;
  siteTitle: string;
  siteDescription: string;
}
