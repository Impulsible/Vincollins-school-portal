/**
 * Decode a URL that may have been encoded multiple times
 */
export function decodeRecursively(encoded: string): string {
  let decoded = encoded;
  let prevDecoded = '';
  
  // Keep decoding until no more changes or no more % signs
  while (decoded !== prevDecoded) {
    prevDecoded = decoded;
    try {
      // Try to decode
      decoded = decodeURIComponent(decoded);
    } catch {
      // If decoding fails, break out of loop
      break;
    }
  }
  
  return decoded;
}

/**
 * Safely get callback URL from search params
 */
export function getCallbackUrl(searchParams: URLSearchParams | null): string {
  if (!searchParams) return '/dashboard';
  
  const callbackParam = searchParams.get('callbackUrl');
  if (!callbackParam) return '/dashboard';
  
  const decoded = decodeRecursively(callbackParam);
  
  // Ensure it's a valid URL path (starts with /) or same origin
  if (decoded.startsWith('http')) {
    try {
      const url = new URL(decoded);
      // Only allow same origin
      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
    } catch {
      // Invalid URL, return default
      return '/dashboard';
    }
  }
  
  // If it's a relative path, ensure it starts with /
  return decoded.startsWith('/') ? decoded : '/dashboard';
}

/**
 * Clean a URL that might have been malformed by multiple redirects
 */
export function cleanRedirectUrl(url: string): string {
  // Remove any potential XSS attempts
  const clean = url.replace(/[<>"']/g, '');
  
  // Decode recursively
  const decoded = decodeRecursively(clean);
  
  // Ensure it's a relative path or same origin
  if (decoded.startsWith('http')) {
    try {
      const urlObj = new URL(decoded);
      // Only allow same origin redirects for security
      if (urlObj.origin === 'http://localhost:3000' || 
          urlObj.origin === 'https://vincollins-school-portal.vercel.app') {
        return decoded;
      }
      return '/dashboard';
    } catch {
      return '/dashboard';
    }
  }
  
  return decoded.startsWith('/') ? decoded : '/dashboard';
}