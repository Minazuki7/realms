/**
 * GET /api/cms/experiences - Get all experiences
 * POST /api/cms/experiences - Add new experience (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const experiencesValue = await getKVValue('cms:experiences');
    const experiences = experiencesValue ? JSON.parse(experiencesValue) : [];
    return createSuccessResponse(experiences);
  } catch (error) {
    console.error('[EXPERIENCES API] Error fetching experiences:', error);
    return createErrorResponse('Failed to fetch experiences', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const experience = await request.json();
    
    // Validate experience
    if (!experience.id || !experience.company) {
      return createErrorResponse('Missing required fields: id, company', 400);
    }

    // Get existing experiences
    const experiencesValue = await getKVValue('cms:experiences');
    const experiences = experiencesValue ? JSON.parse(experiencesValue) : [];
    
    // Add new experience
    experiences.push(experience);
    
    // Save to KV
    const success = await setKVValue('cms:experiences', JSON.stringify(experiences));
    if (!success) {
      throw new Error('Failed to save experiences to KV');
    }
    
    const result = experiences;
    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('[EXPERIENCES API] Error adding experience:', error);
    return createErrorResponse('Failed to add experience', 500);
  }
}
