/**
 * GET /api/cms/education - Get all education entries
 * POST /api/cms/education - Add new education entry (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const educationValue = await getKVValue('cms:education');
    const education = educationValue ? JSON.parse(educationValue) : [];
    return createSuccessResponse(education);
  } catch (error) {
    console.error('[EDUCATION API] Error fetching education:', error);
    return createErrorResponse('Failed to fetch education', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    const edu = await request.json();
    
    // Validate education entry
    if (!edu.id || !edu.institution) {
      return createErrorResponse('Missing required fields: id, institution', 400);
    }

    // Get existing education entries
    const educationValue = await getKVValue('cms:education');
    const education = educationValue ? JSON.parse(educationValue) : [];
    
    // Add new education entry
    education.push(edu);
    
    // Save to KV
    const success = await setKVValue('cms:education', JSON.stringify(education));
    if (!success) {
      throw new Error('Failed to save education to KV');
    }
    
    const result = education;
    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('[EDUCATION API] Error adding education:', error);
    return createErrorResponse('Failed to add education', 500);
  }
}
