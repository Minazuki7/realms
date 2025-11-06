/**
 * CMS API Client
 * Provides type-safe methods for interacting with the CMS API
 */

import type { Bio, Project, Settings } from '@/lib/kv-cms';

class CMSAPIClient {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from session storage (browser only)
    if (typeof window !== 'undefined') {
      this.apiKey = sessionStorage.getItem('cms-api-key');
    }
  }

  private getHeaders(requiresAuth: boolean = false) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      if (!this.apiKey) {
        throw new Error('Not authenticated');
      }
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // ============ BIO ============

  async getBio(): Promise<Bio | null> {
    try {
      const response = await fetch('/api/cms/bio', {
        headers: this.getHeaders(),
      });
      return this.handleResponse<Bio>(response);
    } catch (error) {
      console.error('Failed to fetch bio:', error);
      return null;
    }
  }

  async updateBio(bio: Bio): Promise<Bio | null> {
    try {
      const response = await fetch('/api/cms/bio', {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(bio),
      });
      return this.handleResponse<Bio>(response);
    } catch (error) {
      console.error('Failed to update bio:', error);
      throw error;
    }
  }

  // ============ PROJECTS ============

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch('/api/cms/projects', {
        headers: this.getHeaders(),
      });
      return this.handleResponse<Project[]>(response);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  async addProject(project: Project): Promise<Project[]> {
    try {
      const response = await fetch('/api/cms/projects', {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(project),
      });
      return this.handleResponse<Project[]>(response);
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const response = await fetch(`/api/cms/projects/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/cms/projects/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  // ============ SETTINGS ============

  async getSettings(): Promise<Settings | null> {
    try {
      const response = await fetch('/api/cms/settings', {
        headers: this.getHeaders(),
      });
      return this.handleResponse<Settings>(response);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return null;
    }
  }

  async updateSettings(settings: Settings): Promise<Settings | null> {
    try {
      const response = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(settings),
      });
      return this.handleResponse<Settings>(response);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  // ============ AUTHENTICATION ============

  async authenticate(password: string): Promise<string> {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ password }),
      });
      const data = await this.handleResponse<{ apiKey: string }>(response);
      this.apiKey = data.apiKey;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cms-api-key', data.apiKey);
      }
      return data.apiKey;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cms-api-key', key);
    }
  }

  logout(): void {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cms-api-key');
    }
  }
}

// Export singleton instance
export const cmsAPI = new CMSAPIClient();
