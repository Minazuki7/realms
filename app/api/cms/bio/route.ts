/**
 * GET /api/cms/bio - Get bio data
 * POST /api/cms/bio - Update bio data (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const bioValue = await getKVValue('cms:bio');
    
    if (!bioValue) {
      return createErrorResponse('Bio not found', 404);
    }

    return createSuccessResponse(JSON.parse(bioValue));
  } catch (error) {
    console.error('[BIO API] Error fetching bio:', error);
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

    // Save bio using REST API
    console.log('[BIO API] Calling KV REST API to save bio');
    const success = await setKVValue('cms:bio', JSON.stringify(body));
    
    if (!success) {
      throw new Error('Failed to save bio to KV');
    }

    console.log('[BIO API] Bio saved successfully');
    return createSuccessResponse(body);
  } catch (error) {
    console.error('[BIO API] Error updating bio:', error);
    return createErrorResponse('Failed to update bio', 500);
  }
}
