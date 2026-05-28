import DOMPurify from 'dompurify';

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'em', 'strong', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
