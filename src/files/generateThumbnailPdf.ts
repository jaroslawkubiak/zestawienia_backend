import * as fs from 'fs';
import * as path from 'path';
import { convert } from 'pdf-poppler';

export async function generateThumbnailPdf(
  pdfPath: string,
  fileName: string,
): Promise<string> {
  const thumbnailDir = path.join(path.dirname(pdfPath), 'thumbnail');
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }

  const opts = {
    format: 'png',
    out_dir: thumbnailDir,
    out_prefix: fileName,
    page: 1,
    scale: 600,
  };

  await convert(pdfPath, opts);

  return `${fileName}.png`;
}
