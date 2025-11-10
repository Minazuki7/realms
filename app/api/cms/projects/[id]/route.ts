/**
 * PATCH /api/cms/projects/:id - Update specific project (requires auth)
 * DELETE /api/cms/projects/:id - Delete specific project (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const runtime = 'edge';

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const { id } = await params;
    const updates = await request.json();

    // Get existing projects
    const projectsValue = await getKVValue('cms:projects');
    const projects = projectsValue ? JSON.parse(projectsValue) : [];
    
    // Find and update project
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    if (projectIndex === -1) {
      return createErrorResponse('Project not found', 404);
    }

    projects[projectIndex] = { ...projects[projectIndex], ...updates };
    
    // Save to KV
    const success = await setKVValue('cms:projects', JSON.stringify(projects));
    if (!success) {
      throw new Error('Failed to save projects to KV');
    }

    return createSuccessResponse(projects[projectIndex]);
  } catch (error) {
    console.error('Error updating project:', error);
    return createErrorResponse('Failed to update project', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const { id } = await params;

    // Get existing projects
    const projectsValue = await getKVValue('cms:projects');
    const projects = projectsValue ? JSON.parse(projectsValue) : [];
    
    // Find and remove project
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    if (projectIndex === -1) {
      return createErrorResponse('Project not found', 404);
    }

    const deleted = projects[projectIndex];
    projects.splice(projectIndex, 1);
    
    // Save to KV
    const success = await setKVValue('cms:projects', JSON.stringify(projects));
    if (!success) {
      throw new Error('Failed to save projects to KV');
    }

    return createSuccessResponse({ success: true, id, deleted });
  } catch (error) {
    console.error('Error deleting project:', error);
    return createErrorResponse('Failed to delete project', 500);
  }
}


