/**
 * PATCH /api/cms/projects/:id - Update specific project (requires auth)
 * DELETE /api/cms/projects/:id - Delete specific project (requires auth)
 */

import { NextRequest } from 'next/server';
import { updateProject, deleteProject } from '@/lib/kv-cms';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const { id } = await params;
    const updates = await request.json();

    const result = await updateProject(id, updates);
    
    if (!result) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse(result);
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
    const deleted = await deleteProject(id);

    if (!deleted) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse({ success: true, id });
  } catch (error) {
    console.error('Error deleting project:', error);
    return createErrorResponse('Failed to delete project', 500);
  }
}
