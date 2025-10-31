export function normalizeImageSrc(src?: string, fallback: string = "/product_placeholder.jpg"): string {
	if (!src || typeof src !== 'string') return fallback;
	const trimmed = src.trim();
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
	if (trimmed.startsWith('/')) return trimmed;
	return `/${trimmed}`;
}

// If the image is on Cloudinary, inject safe, cacheable transformations.
export function optimizeCloudinaryUrl(src?: string, transformations: string = 'f_auto,q_auto'): string | undefined {
  if (!src) return src;
  try {
    const url = new URL(src);
    if (!/res\.cloudinary\.com$/i.test(url.hostname)) return src;
    const parts = url.pathname.split('/');
    const uploadIndex = parts.findIndex((p) => p === 'upload');
    if (uploadIndex === -1) return src;
    // If there are already transformations after upload, keep them and prepend ours if missing
    const afterUpload = parts[uploadIndex + 1] || '';
    const hasTransform = afterUpload && !afterUpload.startsWith('v');
    if (hasTransform) {
      if (!afterUpload.includes('f_auto') || !afterUpload.includes('q_auto')) {
        parts[uploadIndex + 1] = `${transformations},${afterUpload}`.replace(/,+/g, ',');
      }
    } else {
      parts.splice(uploadIndex + 1, 0, transformations);
    }
    url.pathname = parts.join('/');
    return url.toString();
  } catch {
    return src;
  }
}

export function optimizeForHero(src?: string): string {
  const normalized = normalizeImageSrc(src);
  // Fit entire image within the hero box without cropping, upscale if needed
  const optimized = optimizeCloudinaryUrl(normalized, 'f_auto,q_auto,c_fit,w_1400,h_520');
  return optimized || normalized;
}



