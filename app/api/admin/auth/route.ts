/**
 * POST /api/admin/auth - Authenticate with password
 * Returns an API key for subsequent requests
 */

import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'admin-password-change-me';
const ADMIN_API_KEY = process.env.CMS_ADMIN_API_KEY || 'dev-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return createErrorResponse('Password required', 400);
    }

    if (password !== ADMIN_PASSWORD) {
      return createErrorResponse('Invalid password', 401);
    }

    return createSuccessResponse({
      apiKey: ADMIN_API_KEY,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Error in authentication:', error);
    return createErrorResponse('Authentication failed', 500);
  }
}
