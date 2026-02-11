export function minifyHtml(html: string): string {
  return html
    .replace(/\t+/g, '')
    .replace(/\n+/g, '')
    .replace(/\r+/g, '')
    .replace(/>\s+</g, '><')
    .trim();
}
