/**
 * Simple obfuscation for download URLs
 * This prevents casual users from seeing the destination in the status bar
 */

export function encodeDownloadUrl(url) {
  if (!url) return '';
  // Convert URL to Base64 and add some "noise"
  const b64 = btoa(url);
  // Add random chars at start and end
  const prefix = Math.random().toString(36).substring(2, 7);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${prefix}${b64}${suffix}`;
}

export function decodeDownloadUrl(token) {
  if (!token) return '';
  try {
    // Remove the 5 random salt chars from start and end
    const b64 = token.substring(5, token.length - 5);
    return atob(b64);
  } catch (err) {
    console.error('Failed to decode URL:', err);
    return '';
  }
}
