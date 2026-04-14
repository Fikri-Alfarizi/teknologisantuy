/**
 * Simple obfuscation for download URLs
 * This prevents casual users from seeing the destination in the status bar
 */

export function encodeDownloadUrl(url) {
  if (!url) return '';
  // SSR safe Base64
  const b64 = typeof btoa !== 'undefined' 
    ? btoa(url) 
    : Buffer.from(url).toString('base64');
    
  const prefix = Math.random().toString(36).substring(2, 7);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${prefix}${b64}${suffix}`;
}

export function decodeDownloadUrl(token) {
  if (!token) return '';
  try {
    const b64 = token.substring(5, token.length - 5);
    return typeof atob !== 'undefined' 
      ? atob(b64) 
      : Buffer.from(b64, 'base64').toString('utf-8');
  } catch (err) {
    console.error('Failed to decode URL:', err);
    return '';
  }
}
