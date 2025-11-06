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
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const project = await request.json();
    
    // Validate project
    if (!project.id || !project.title) {
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
