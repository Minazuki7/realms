/**
 * Authentication utility for CMS API
 * Uses API key from environment variable for protection
 */

import { headers } from 'next/headers';

const ADMIN_API_KEY = process.env.CMS_ADMIN_API_KEY;

export interface AuthToken {
  authenticated: boolean;
  error?: string;
}

/**
 * Verify API key from request headers
 * Expects: Authorization: Bearer <api-key>
 */
export async function verifyApiKey(): Promise<AuthToken> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization') || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid Authorization header',
      };
    }

    const token = authHeader.substring(7);
    
    if (token !== ADMIN_API_KEY) {
      return {
        authenticated: false,
        error: 'Invalid API key',
      };
    }

    return { authenticated: true };
  } catch (error) {
    return {
      authenticated: false,
      error: 'Authentication error',
    };
  }
}

/**
 * Create error response
 */
export function createErrorResponse(message: string, status: number = 400) {
  return Response.json(
    { error: message },
    { status }
  );
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return Response.json(data, { status });
}
