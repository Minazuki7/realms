/**
 * GET /api/cms/projects - Get all projects
 * POST /api/cms/projects - Add new project (requires auth)
 */

import { NextRequest } from 'next/server';
import { getProjects, addProject } from '@/lib/kv-cms';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const projects = await getProjects();
    return createSuccessResponse(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
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

    const result = await addProject(project);
    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('Error adding project:', error);
    return createErrorResponse('Failed to add project', 500);
  }
}
