/**
 * GET /api/cms/settings - Get settings
 * POST /api/cms/settings - Update settings (requires auth)
 */

import { NextRequest } from 'next/server';
import { getSettings, setSettings, updateSettings } from '@/lib/kv-cms';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const settings = await getSettings();
    
    if (!settings) {
      return createErrorResponse('Settings not found', 404);
    }

    return createSuccessResponse(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
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

    // Update or create settings
    let result;
    const existingSettings = await getSettings();
    
    if (existingSettings) {
      result = await updateSettings(body);
    } else {
      await setSettings(body);
      result = body;
    }

    return createSuccessResponse(result);
  } catch (error) {
    console.error('Error updating settings:', error);
    return createErrorResponse('Failed to update settings', 500);
  }
}
