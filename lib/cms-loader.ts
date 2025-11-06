/**
 * CMS Data Loading Layer
 * Attempts to load from Cloudflare KV first, falls back to local files
 * This allows for seamless transition from file-based to KV-based CMS
 */

import { getBio as getKVBio, getProjects as getKVProjects, getSettings as getKVSettings } from '@/lib/kv-cms';
import { getBio as getFileBio, getProjects as getFileProjects, getSettings as getFileSettings } from '@/lib/cms';
import type { Bio, Project, Settings } from '@/lib/kv-cms';

/**
 * Get bio data from KV, fall back to file
 */
export async function getBio(): Promise<Bio | null> {
  try {
    // Try KV first
    const kvBio = await getKVBio();
    if (kvBio) return kvBio;
  } catch (error) {
    console.warn('KV bio fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    return getFileBio();
  } catch (error) {
    console.error('Failed to load bio from file:', error);
    return null;
  }
}

/**
 * Get projects from KV, fall back to file
 */
export async function getProjects(): Promise<Project[]> {
  try {
    // Try KV first
    const kvProjects = await getKVProjects();
    if (kvProjects && kvProjects.length > 0) return kvProjects;
  } catch (error) {
    console.warn('KV projects fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    return getFileProjects();
  } catch (error) {
    console.error('Failed to load projects from file:', error);
    return [];
  }
}

/**
 * Get settings from KV, fall back to file
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    // Try KV first
    const kvSettings = await getKVSettings();
    if (kvSettings) return kvSettings;
  } catch (error) {
    console.warn('KV settings fetch failed, falling back to file:', error);
  }

  try {
    // Fall back to file
    return getFileSettings();
  } catch (error) {
    console.error('Failed to load settings from file:', error);
    return null;
  }
}
