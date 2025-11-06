/**
 * Direct KV API access for Cloudflare Pages
 * Since bindings don't work directly in Next.js on Cloudflare Pages,
 * we use the Cloudflare KV REST API instead
 */

const KV_API_BASE = 'https://api.cloudflare.com/client/v4/accounts';

async function getKVValue(key: string): Promise<string | null> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    
    if (!accountId || !apiToken || !namespaceId) {
      console.warn('[KV API] Missing Cloudflare credentials');
      return null;
    }
    
    const url = `${KV_API_BASE}/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });
    
    if (res.status === 404) {
      return null;
    }
    
    if (!res.ok) {
      console.error('[KV API] Error fetching value:', res.status, await res.text());
      return null;
    }
    
    return await res.text();
  } catch (error) {
    console.error('[KV API] Error in getKVValue:', error);
    return null;
  }
}

async function setKVValue(key: string, value: string, ttl?: number): Promise<boolean> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    
    if (!accountId || !apiToken || !namespaceId) {
      console.warn('[KV API] Missing Cloudflare credentials for write');
      return false;
    }
    
    const url = `${KV_API_BASE}/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/octet-stream',
    };
    
    if (ttl) {
      headers['X-TTL-Seconds'] = ttl.toString();
    }
    
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: value,
    });
    
    if (!res.ok) {
      console.error('[KV API] Error setting value:', res.status, await res.text());
      return false;
    }
    
    console.log('[KV API] Successfully set key:', key);
    return true;
  } catch (error) {
    console.error('[KV API] Error in setKVValue:', error);
    return false;
  }
}

export { getKVValue, setKVValue };
