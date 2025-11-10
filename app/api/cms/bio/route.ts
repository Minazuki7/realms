/**
 * GET /api/cms/bio - Get bio data
 * POST /api/cms/bio - Update bio data (requires auth)
 * DELETE /api/cms/bio - Clear bio data (requires auth)
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
    // Check for clear action FIRST (before parsing body)
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    console.log('[BIO API] POST received, action:', action);
    
    if (action === 'clear') {
      console.log('[BIO API] Processing clear action');
      try {
        // Verify authentication
        const auth = await verifyApiKey();
        console.log('[BIO API] Clear auth:', auth.authenticated);
        if (!auth.authenticated) {
          return createErrorResponse(auth.error || 'Unauthorized', 401);
        }

        // Clear bio
        console.log('[BIO API] Calling setKVValue to clear bio');
        const success = await setKVValue('cms:bio', '');
        console.log('[BIO API] setKVValue result:', success);
        
        if (!success) {
          return createErrorResponse('Failed to clear bio to KV', 500);
        }
        
        console.log('[BIO API] Bio cleared successfully');
        return createSuccessResponse({ message: 'Bio cleared' });
      } catch (clearError) {
        console.error('[BIO API] Error clearing bio:', clearError);
        return createErrorResponse('Failed to clear bio', 500);
      }
    }
    
    console.log('[BIO API] POST request received');
    
    // Verify authentication
    const auth = await verifyApiKey();
    console.log('[BIO API] Auth result:', auth.authenticated);
    
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[BIO API] Error parsing JSON:', parseError);
      return createErrorResponse('Invalid or missing request body', 400);
    }
    
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
