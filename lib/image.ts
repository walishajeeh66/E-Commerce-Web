export function normalizeImageSrc(src?: string, fallback: string = "/product_placeholder.jpg"): string {
	if (!src || typeof src !== 'string') return fallback;
	const trimmed = src.trim();
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
	if (trimmed.startsWith('/')) return trimmed;
	return `/${trimmed}`;
}



