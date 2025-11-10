/**
 * CMS Data Loading Layer - Edge Runtime Compatible
 * Loads data from Cloudflare KV via REST API
 * For Node.js runtime, use @/lib/cms directly
 */

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
 * Get bio data from KV via API
 */
export async function getBio(): Promise<Bio | null> {
  const kvBio = await fetchFromAPI<Bio>('bio');
  if (kvBio) {
    console.log('[CMS-Loader] Loaded bio from KV');
    return kvBio;
  }
  
  console.error('[CMS-Loader] Failed to load bio');
  return null;
}

/**
 * Get projects from KV via API
 */
export async function getProjects(): Promise<Project[]> {
  const kvProjects = await fetchFromAPI<Project[]>('projects');
  if (kvProjects && Array.isArray(kvProjects) && kvProjects.length > 0) {
    console.log('[CMS-Loader] Loaded projects from KV');
    return kvProjects;
  }
  
  console.error('[CMS-Loader] Failed to load projects');
  return [];
}

/**
 * Get settings from KV via API
 */
export async function getSettings(): Promise<Settings | null> {
  const kvSettings = await fetchFromAPI<Settings>('settings');
  if (kvSettings) {
    console.log('[CMS-Loader] Loaded settings from KV');
    return kvSettings;
  }
  
  console.error('[CMS-Loader] Failed to load settings');
  return null;
}