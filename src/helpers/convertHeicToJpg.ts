import * as fs from 'fs';
import * as path from 'path';

interface IConvertedHeicImage {
  path: string;
  type: 'JPG';
  filename: string;
  newSanitizedName: string;
}
export async function convertHeicToJpg(
  file: Express.Multer.File,
): Promise<IConvertedHeicImage> {
  const convert = require('heic-convert');
  const inputBuffer = await fs.promises.readFile(file.path);

  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9,
  });

  const newPath = path.join(
    path.dirname(file.path),
    path.basename(file.path, path.extname(file.path)) + '.jpg',
  );
  await fs.promises.writeFile(newPath, outputBuffer);
  await fs.promises.unlink(file.path);

  const ext = path.extname(file.filename);
  const baseName = path.basename(file.filename, ext);
  const newFilename = `${baseName}.jpg`;

  const sanitizedExt = path.extname(file['sanitizedOriginalName']);
  const sanitizedBase = path.basename(
    file['sanitizedOriginalName'],
    sanitizedExt,
  );
  const newSanitizedName = `${sanitizedBase}.jpg`;

  return {
    path: newPath,
    filename: newFilename,
    newSanitizedName,
    type: 'JPG',
  };
}
