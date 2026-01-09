export function safeFileName(name: string): string {
  return (
    name
      // ręczna mapa znaków które NIE normalizują się poprawnie
      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'L')

      // normalizacja unicode (ą, ę, ś, ó itd.)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')

      // tylko bezpieczne znaki plików
      .replace(/[^\w\s.-]/g, '')

      // porządki
      .trim()
      .replace(/\s+/g, '-')
  );
}
