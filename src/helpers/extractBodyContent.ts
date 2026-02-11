export function extractBodyContent(html: string): string {
  if (!html) return html;

  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1].trim() : html;
}
