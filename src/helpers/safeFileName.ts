export function safeFileName(name: string): string {
  return (
    name
      .replace(/ą/g, 'a')
      .replace(/Ą/g, 'A')

      .replace(/ś/g, 's')
      .replace(/Ś/g, 'S')

      .replace(/ż/g, 'z')
      .replace(/Ż/g, 'Z')

      .replace(/ź/g, 'z')
      .replace(/Ź/g, 'Z')

      .replace(/ć/g, 'c')
      .replace(/Ć/g, 'C')

      .replace(/ó/g, 'o')
      .replace(/Ó/g, 'O')

      .replace(/ń/g, 'n')
      .replace(/Ń/g, 'N')

      .replace(/ę/g, 'e')
      .replace(/Ę/g, 'E')

      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'L')

      // normalize Unicode
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')

      // delete everything, except: letters, numbers, dashes, underscore and dots
      .replace(/[^\w.-]/g, '-')

      // remove multiple dashes/whitespace
      .replace(/-+/g, '-')
      .replace(/^\-+|\-+$/g, '')
      .trim()
  );
}
