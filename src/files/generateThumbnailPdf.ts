import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { getDocument } from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import { safeFileName } from '../helpers/safeFileName';
import { ThumbnailError } from './ThumbnailError';

export async function generateThumbnailPdf(
  pdfPath: string,
  fileName: string,
): Promise<string> {
  try {
    const thumbnailDir = path.join(path.dirname(pdfPath));

    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const tempPdfPath = path.join(os.tmpdir(), `${uuidv4()}.pdf`);
    await fs.promises.copyFile(pdfPath, tempPdfPath);

    const data = new Uint8Array(await fs.promises.readFile(tempPdfPath));

    const pdf = await getDocument({
      data,
      standardFontDataUrl: path.join(
        __dirname,
        'node_modules/pdfjs-dist/legacy/build/gfx/standard_fonts/',
      ),
    }).promise;

    const page = await pdf.getPage(1);
    const originalViewport = page.getViewport({ scale: 1 });
    const targetWidth = 800;
    const scale = targetWidth / originalViewport.width;
    const viewportScaled = page.getViewport({ scale });

    const canvas = createCanvas(viewportScaled.width, viewportScaled.height);
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context as any,
      viewport: viewportScaled,
    }).promise;

    const safeFileNameForThumb = safeFileName(path.parse(fileName).name);
    const outputPath = path.join(thumbnailDir, `${safeFileNameForThumb}.jpg`);
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.7 });
    await fs.promises.writeFile(outputPath, buffer);

    await fs.promises.unlink(tempPdfPath);

    return `${safeFileNameForThumb}.jpg`;
  } catch (error) {
    throw new ThumbnailError(error, 'd3d94468-9a6f-4c11-8a21-2f3e4d5c6b77');
  }
}
