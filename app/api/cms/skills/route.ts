/**
 * GET /api/cms/skills - Get all skills
 * POST /api/cms/skills - Add new skill (requires auth)
 */

import { NextRequest } from 'next/server';
import { getKVValue, setKVValue } from '@/lib/kv-direct-api';
import { verifyApiKey, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const skillsValue = await getKVValue('cms:skills');
    const skills = skillsValue ? JSON.parse(skillsValue) : [];
    return createSuccessResponse(skills);
  } catch (error) {
    console.error('[SKILLS API] Error fetching skills:', error);
    return createErrorResponse('Failed to fetch skills', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for clear action FIRST (before parsing body)
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'clear') {
      try {
        // Verify authentication
        const auth = await verifyApiKey();
        if (!auth.authenticated) {
          return createErrorResponse(auth.error || 'Unauthorized', 401);
        }

        // Clear all skills
        await setKVValue('cms:skills', JSON.stringify([]));
        console.log('[SKILLS API] All skills cleared successfully');
        return createSuccessResponse({ message: 'All skills cleared' });
      } catch (clearError) {
        console.error('[SKILLS API] Error clearing skills:', clearError);
        return createErrorResponse('Failed to clear skills', 500);
      }
    }
    
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    let skill;
    try {
      skill = await request.json();
    } catch (parseError) {
      console.error('[SKILLS API] Error parsing JSON:', parseError);
      return createErrorResponse('Invalid or missing request body', 400);
    }
    
    // Validate skill
    if (!skill || !skill.id || !skill.name) {
      return createErrorResponse('Missing required fields: id, name', 400);
    }

    // Get existing skills
    const skillsValue = await getKVValue('cms:skills');
    const skills = skillsValue ? JSON.parse(skillsValue) : [];
    
    // Add new skill
    skills.push(skill);
    
    // Save to KV
    const success = await setKVValue('cms:skills', JSON.stringify(skills));
    if (!success) {
      throw new Error('Failed to save skills to KV');
    }
    
    const result = skills;
    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('[SKILLS API] Error adding skill:', error);
    return createErrorResponse('Failed to add skill', 500);
  }
}
