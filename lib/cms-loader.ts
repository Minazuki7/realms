/**
 * CMS Data Loading Layer
 * Attempts to load from Cloudflare KV first via REST API, falls back to local files
 * This allows for seamless transition from file-based to KV-based CMS
 */

import { getBio as getFileBio, getProjects as getFileProjects, getSettings as getFileSettings } from '@/lib/cms';
import type { Bio, Project, Settings } from '@/lib/kv-types';

/**
 * Fetch data from API endpoint, which uses REST API to access KV
 */
async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${process.env.SITE_URL || ''}/api/cms/${endpoint}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.warn(`[CMS-Loader] API fetch failed for ${endpoint}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data || data || null;
  } catch (error) {
    console.warn(`[CMS-Loader] API fetch error for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Get bio data from KV via API, fall back to file
 */
export async function getBio(): Promise<Bio | null> {
  try {
    // Try KV via REST API first
    const kvBio = await fetchFromAPI<Bio>('bio');
    if (kvBio) {
      console.log('[CMS-Loader] Loaded bio from KV');
      return kvBio;
    }
  } catch (error) {
    console.warn('[CMS-Loader] KV bio fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    console.log('[CMS-Loader] Falling back to file-based bio');
    const fileBio = getFileBio();
    
    // Transform file-based bio to match KV structure
    return {
      ...fileBio,
      skills: {
        frontend: Array.isArray(fileBio.skills.frontend) 
          ? { expert: fileBio.skills.frontend, advanced: [] }
          : fileBio.skills.frontend,
        backend: Array.isArray(fileBio.skills.backend)
          ? { expert: fileBio.skills.backend, advanced: [] }
          : fileBio.skills.backend,
        tools: Array.isArray(fileBio.skills.tools)
          ? { expert: fileBio.skills.tools, advanced: [] }
          : fileBio.skills.tools,
      }
    } as Bio;
  } catch (error) {
    console.error('[CMS-Loader] Failed to load bio from file:', error);
    return null;
  }
}

/**
 * Get projects from KV via API, fall back to file
 */
export async function getProjects(): Promise<Project[]> {
  try {
    // Try KV via REST API first
    const kvProjects = await fetchFromAPI<Project[]>('projects');
    if (kvProjects && Array.isArray(kvProjects) && kvProjects.length > 0) {
      console.log('[CMS-Loader] Loaded projects from KV');
      return kvProjects;
    }
  } catch (error) {
    console.warn('[CMS-Loader] KV projects fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    console.log('[CMS-Loader] Falling back to file-based projects');
    const fileProjects = getFileProjects();
    return fileProjects.map(project => ({
      ...project,
      technologies: (project as any).technologies || (project as any).stack || []
    }));
  } catch (error) {
    console.error('[CMS-Loader] Failed to load projects from file:', error);
    return [];
  }
}

/**
 * Get settings from KV via API, fall back to file
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    // Try KV via REST API first
    const kvSettings = await fetchFromAPI<Settings>('settings');
    if (kvSettings) {
      console.log('[CMS-Loader] Loaded settings from KV');
      return kvSettings;
    }
  } catch (error) {
    console.warn('[CMS-Loader] KV settings fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    console.log('[CMS-Loader] Falling back to file-based settings');
    return getFileSettings();
  } catch (error) {
    console.error('[CMS-Loader] Failed to load settings from file:', error);
    return null;
  }
}
