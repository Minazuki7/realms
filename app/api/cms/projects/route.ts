/**
 * GET /api/cms/projects - Get all projects
 * POST /api/cms/projects - Add new project (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const projectsValue = await getKVValue('cms:projects');
    const projects = projectsValue ? JSON.parse(projectsValue) : [];
    return createSuccessResponse(projects);
  } catch (error) {
    console.error('[PROJECTS API] Error fetching projects:', error);
    return createErrorResponse('Failed to fetch projects', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for clear action FIRST (before parsing body)
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    console.log('[PROJECTS API] POST received, action:', action);
    
    if (action === 'clear') {
      console.log('[PROJECTS API] Processing clear action');
      try {
        // Verify authentication
        const auth = await verifyApiKey();
        if (!auth.authenticated) {
          return createErrorResponse(auth.error || 'Unauthorized', 401);
        }

        // Clear all projects
        await setKVValue('cms:projects', JSON.stringify([]));
        console.log('[PROJECTS API] All projects cleared successfully');
        return createSuccessResponse({ message: 'All projects cleared' });
      } catch (clearError) {
        console.error('[PROJECTS API] Error clearing projects:', clearError);
        return createErrorResponse('Failed to clear projects', 500);
      }
    }
    
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    let project;
    try {
      project = await request.json();
    } catch (parseError) {
      console.error('[PROJECTS API] Error parsing JSON:', parseError);
      return createErrorResponse('Invalid or missing request body', 400);
    }
    
    // Validate project
    if (!project || !project.id || !project.title) {
      return createErrorResponse('Missing required fields: id, title', 400);
    }

    // Get existing projects
    const projectsValue = await getKVValue('cms:projects');
    const projects = projectsValue ? JSON.parse(projectsValue) : [];
    
    // Add new project
    projects.push(project);
    
    // Save to KV
    const success = await setKVValue('cms:projects', JSON.stringify(projects));
    if (!success) {
      throw new Error('Failed to save projects to KV');
    }
    
    const result = projects;
    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('[PROJECTS API] Error adding project:', error);
    return createErrorResponse('Failed to add project', 500);
  }
}
