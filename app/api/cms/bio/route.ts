/**
 * GET /api/cms/bio - Get bio data
 * POST /api/cms/bio - Update bio data (requires auth)
 */

import { NextRequest } from 'next/server';
import { getBio, setBio, updateBio } from '@/lib/kv-cms';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

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
    console.log('[BIO API] POST request received');
    
    // Verify authentication
    const auth = await verifyApiKey();
    console.log('[BIO API] Auth result:', auth.authenticated);
    
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const body = await request.json();
    console.log('[BIO API] Request body received:', !!body);
    
    // Validate body
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Invalid request body', 400);
    }

    // Update or create bio
    let result;
    const existingBio = await getBio();
    console.log('[BIO API] Existing bio found:', !!existingBio);
    
    if (existingBio) {
      console.log('[BIO API] Updating bio');
      result = await updateBio(body);
    } else {
      console.log('[BIO API] Creating new bio');
      await setBio(body);
      result = body;
    }

    console.log('[BIO API] Bio saved successfully');
    return createSuccessResponse(result);
  } catch (error) {
    console.error('[BIO API] Error updating bio:', error);
    return createErrorResponse('Failed to update bio', 500);
  }
}
