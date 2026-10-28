/**
 * Escapes characters that have special syntactic meaning in Telegram legacy Markdown (V1).
 * Specifically: _ * ` [ ]
 */
export function escapeMarkdown(text: string | null | undefined): string {
  if (!text) return '';
  return String(text).replace(/([_*`\[\]])/g, '\\$1');
}
