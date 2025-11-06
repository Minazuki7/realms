/**
 * GET /api/cms/bio - Get bio data
 * POST /api/cms/bio - Update bio data (requires auth)
 */

import { NextRequest } from 'next/server';
import { getBio, setBio, updateBio } from '@/lib/kv-cms';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function GET() {
  try {
    const bio = await getBio();
    
    if (!bio) {
      return createErrorResponse('Bio not found', 404);
    }

    return createSuccessResponse(bio);
  } catch (error) {
    console.error('Error fetching bio:', error);
    return createErrorResponse('Failed to fetch bio', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const body = await request.json();
    
    // Validate body
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Invalid request body', 400);
    }

    // Update or create bio
    let result;
    const existingBio = await getBio();
    
    if (existingBio) {
      result = await updateBio(body);
    } else {
      await setBio(body);
      result = body;
    }

    return createSuccessResponse(result);
  } catch (error) {
    console.error('Error updating bio:', error);
    return createErrorResponse('Failed to update bio', 500);
  }
}
