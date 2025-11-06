/**
 * Cloudflare KV CMS utilities
 * Provides getter and setter functions for managing bio, projects, and settings
 */

// Dynamic import to handle Cloudflare Pages environment
let getRequestContext: any = null;
try {
  // Only available in Cloudflare Pages environment
  const mod = require('@cloudflare/next-on-pages');
  getRequestContext = mod.getRequestContext;
} catch (e) {
  // Not in Cloudflare Pages environment or not installed
}

export interface Bio {
  name: string;
  title: string;
  intro: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  photo: string;
  about: string;
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    tools: string[];
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  link: string;
  featured: boolean;
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

// KV namespace keys
const KEYS = {
  BIO: 'cms:bio',
  PROJECTS: 'cms:projects',
  SETTINGS: 'cms:settings',
} as const;

/**
 * Get Cloudflare KV namespace
 * In development, falls back to in-memory storage
 */
function getKVNamespace() {
  try {
    const { env } = getRequestContext();
    return env.CMS;
  } catch (error) {
    console.warn('KV namespace not available, using fallback');
    return null;
  }
}

/**
 * Cache for development (when KV is not available)
 */
const memoryCache = new Map<string, any>();

/**
 * Get a value from KV store
 */
async function getValue<T>(key: string): Promise<T | null> {
  const kv = getKVNamespace();
  
  if (!kv) {
    return memoryCache.get(key) || null;
  }

  try {
    const value = await kv.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting value from KV for key ${key}:`, error);
    return null;
  }
}

/**
 * Set a value in KV store
 */
async function setValue<T>(key: string, value: T, expirationTtl?: number): Promise<void> {
  const kv = getKVNamespace();
  
  if (!kv) {
    memoryCache.set(key, value);
    return;
  }

  try {
    await kv.put(key, JSON.stringify(value), {
      expirationTtl,
    });
  } catch (error) {
    console.error(`Error setting value in KV for key ${key}:`, error);
    throw error;
  }
}

/**
 * Delete a value from KV store
 */
async function deleteValue(key: string): Promise<void> {
  const kv = getKVNamespace();
  
  if (!kv) {
    memoryCache.delete(key);
    return;
  }

  try {
    await kv.delete(key);
  } catch (error) {
    console.error(`Error deleting value from KV for key ${key}:`, error);
    throw error;
  }
}

// ============ BIO FUNCTIONS ============

export async function getBio(): Promise<Bio | null> {
  return getValue<Bio>(KEYS.BIO);
}

export async function setBio(bio: Bio): Promise<void> {
  await setValue(KEYS.BIO, bio);
}

export async function updateBio(updates: Partial<Bio>): Promise<Bio | null> {
  const current = await getBio();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  await setBio(updated);
  return updated;
}

// ============ PROJECTS FUNCTIONS ============

export async function getProjects(): Promise<Project[]> {
  const projects = await getValue<Project[]>(KEYS.PROJECTS);
  return projects || [];
}

export async function setProjects(projects: Project[]): Promise<void> {
  await setValue(KEYS.PROJECTS, projects);
}

export async function addProject(project: Project): Promise<Project[]> {
  const current = await getProjects();
  const updated = [...current, project];
  await setProjects(updated);
  return updated;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = { ...projects[index], ...updates };
  await setProjects(projects);
  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  await setProjects(filtered);
  return true;
}

// ============ SETTINGS FUNCTIONS ============

export async function getSettings(): Promise<Settings | null> {
  return getValue<Settings>(KEYS.SETTINGS);
}

export async function setSettings(settings: Settings): Promise<void> {
  await setValue(KEYS.SETTINGS, settings);
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings | null> {
  const current = await getSettings();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  await setSettings(updated);
  return updated;
}

// ============ INITIALIZATION ============

/**
 * Initialize CMS with default data from local CMS files
 * This should be called once to seed the KV store
 */
export async function initializeCMS(): Promise<void> {
  try {
    // Check if data already exists
    const [existingBio, existingProjects, existingSettings] = await Promise.all([
      getBio(),
      getProjects(),
      getSettings(),
    ]);

    // Only initialize if data doesn't exist
    if (!existingBio) {
      console.log('Initializing BIO...');
      // Will be set during first setup
    }
    if (existingProjects.length === 0) {
      console.log('Initializing PROJECTS...');
      // Will be set during first setup
    }
    if (!existingSettings) {
      console.log('Initializing SETTINGS...');
      // Will be set during first setup
    }
  } catch (error) {
    console.error('Error initializing CMS:', error);
  }
}

/**
 * Get all CMS data at once
 */
export async function getAllCMSData() {
  const [bio, projects, settings] = await Promise.all([
    getBio(),
    getProjects(),
    getSettings(),
  ]);

  return {
    bio,
    projects,
    settings,
  };
}
