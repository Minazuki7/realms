/**
 * GET /api/cms/settings - Get settings
 * POST /api/cms/settings - Update settings (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const settingsValue = await getKVValue('cms:settings');
    
    if (!settingsValue) {
      return createErrorResponse('Settings not found', 404);
    }

    return createSuccessResponse(JSON.parse(settingsValue));
  } catch (error) {
    console.error('[SETTINGS API] Error fetching settings:', error);
    return createErrorResponse('Failed to fetch settings', 500);
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

    // Save settings using REST API
    const success = await setKVValue('cms:settings', JSON.stringify(body));
    
    if (!success) {
      throw new Error('Failed to save settings to KV');
    }

    return createSuccessResponse(body);
  } catch (error) {
    console.error('[SETTINGS API] Error updating settings:', error);
    return createErrorResponse('Failed to update settings', 500);
  }
}


