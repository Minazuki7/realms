/**
 * POST /api/cms/clear - Clear all CMS data (requires auth)
 */

import { NextRequest } from 'next/server';
import { setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    // Clear all CMS keys
    const keysToDelete = [
      'cms:bio',
      'cms:projects',
      'cms:experiences',
      'cms:education',
      'cms:skills',
      'cms:settings',
    ];

    const results = await Promise.allSettled(
      keysToDelete.map(key => setKVValue(key, ''))
    );

    const cleared = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[CLEAR API] Cleared ${cleared}/${keysToDelete.length} CMS keys`);

    if (failed > 0) {
      console.warn(`[CLEAR API] Failed to clear ${failed} keys`);
    }

    return createSuccessResponse({
      cleared,
      failed,
      message: `Cleared ${cleared} CMS keys`,
    });
  } catch (error) {
    console.error('[CLEAR API] Error clearing CMS data:', error);
    return createErrorResponse('Failed to clear CMS data', 500);
  }
}
