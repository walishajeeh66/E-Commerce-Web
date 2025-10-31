import DOMPurify from 'dompurify';

/**
 * Enhanced function to sanitize text and prevent XSS
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export function sanitize(text: string | null | undefined): string {
  if (!text) return '';
  
  // For client-side, use DOMPurify with strict settings
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(text, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      FORBID_TAGS: ['script', 'img', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect', 'onkeydown', 'onkeyup', 'onkeypress']
    });
  }
  
  // For server-side, use comprehensive escaping
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
}

/**
 * Sanitize HTML content that needs to preserve some formatting
 * @param text - The HTML text to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(text: string | null | undefined): string {
  if (!text) return '';
  
  // For client-side, use DOMPurify with limited allowed tags
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'li', 'h2', 'h3'],
      ALLOWED_ATTR: ['class'],
      KEEP_CONTENT: true,
      FORBID_TAGS: ['script', 'img', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect', 'onkeydown', 'onkeyup', 'onkeypress']
    });
  }
  
  // For server-side, do a minimal allowlist sanitizer to match client output
  const allowedTags = new Set(['p','br','strong','em','u','b','i','ul','li','h2','h3']);
  // 1) Remove forbidden tags entirely with their brackets
  let sanitized = text.replace(/<\/?(script|img|iframe|object|embed|form|input|button|link|meta|style)[^>]*>/gi, '');
  // 2) Keep only allowed tags and the class attribute
  sanitized = sanitized.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag, attrs) => {
    const t = String(tag).toLowerCase();
    if (!allowedTags.has(t)) return '';
    if (match.startsWith('</')) return `</${t}>`;
    let cls = '';
    const m = String(attrs || '').match(/\bclass\s*=\s*("([^"]*)"|'([^']*)')/i);
    if (m) {
      const val = m[2] ?? m[3] ?? '';
      cls = val ? ` class="${val.replace(/"/g, '&quot;')}"` : '';
    }
    return `<${t}${cls}>`;
  });
  return sanitized;
}
