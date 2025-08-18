/**
 * Resolves profile picture URLs to ensure they are absolute and working
 * Handles Cloudinary URLs, local uploads, and provides fallbacks
 */
export function resolveProfilePicture(profilePicture) {
  // Return null for empty/undefined to let InitialAvatar show initials
  if (!profilePicture || profilePicture.trim() === '') {
    return null;
  }
  
  // Filter out invalid Windows file paths that shouldn't be URLs
  if (/^[A-Z]:[\\//]/.test(profilePicture)) {
    console.warn('Invalid Windows file path in profilePicture:', profilePicture);
    return null;
  }
  
  // If already absolute URL (Cloudinary, external), return as-is
  if (/^https?:\/\//i.test(profilePicture)) {
    return profilePicture;
  }
  
  // Handle relative local uploads by making them absolute
  const apiPort = import.meta.env.VITE_API_PORT;
  const origin = window.location.origin.replace(/:\d+$/, '');
  const baseUrl = apiPort ? `${origin}:${apiPort}` : origin;
  
  // Ensure leading slash for relative paths
  const path = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;
  
  return `${baseUrl}${path}`;
}

/**
 * Enhanced avatar URL resolver with cache busting and error handling
 */
export function enhancedResolveAvatar(profilePicture, addCacheBuster = false) {
  const resolved = resolveProfilePicture(profilePicture);
  
  if (!resolved) return null;
  
  // Add cache buster for recently updated images
  if (addCacheBuster && !resolved.includes('?')) {
    return `${resolved}?t=${Date.now()}`;
  }
  
  return resolved;
}

/**
 * Gets fallback default avatar URL
 */
export function getDefaultAvatar() {
  return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
}
