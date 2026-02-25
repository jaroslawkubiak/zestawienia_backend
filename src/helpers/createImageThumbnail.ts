import * as path from 'path';
import * as sharp from 'sharp';
import { IProcessFile } from '../files/types/IProcessFile';

sharp.cache(false);

export async function createImageThumbnail(
  file: Express.Multer.File,
  originalFileName: string,
  uploadPath: string,
): Promise<IProcessFile> {
  const MAX_DIMENSION = 1000;
  const MINI_DIMENSION = 400;

  const input = file.buffer ?? file.path;

  if (!input) {
    throw new Error('Brak źródła obrazu (buffer/path)');
  }

  const metadata = await sharp(input).metadata();

  const processFile: IProcessFile = {
    dimensions: {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
    },
  };

  // if image is small - don't generate thumbnail
  if (
    (metadata.width ?? 0) < MAX_DIMENSION &&
    (metadata.height ?? 0) < MAX_DIMENSION
  ) {
    return processFile;
  }

  // generate name
  const ext = path.extname(originalFileName);
  const nameWithoutExt = path.basename(originalFileName, ext);
  const thumbnailFileName = `${nameWithoutExt}_mini${ext}`;
  const miniPath = path.join(uploadPath, thumbnailFileName);

  // save thumbnail
  await sharp(input)
    .resize({
      width: MINI_DIMENSION,
      height: MINI_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(miniPath);

  processFile.thumbnailFileName = thumbnailFileName;
  processFile.thumbnailPath = miniPath;

  return processFile;
}
