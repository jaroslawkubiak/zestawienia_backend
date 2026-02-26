import * as path from 'path';
import * as sharp from 'sharp';
import { ThumbnailError } from '../files/ThumbnailError';
import { IProcessFile } from '../files/types/IProcessFile';

sharp.cache(false);

export async function createImageThumbnail(
  file: Express.Multer.File,
  originalFileName: string,
  uploadPath: string,
): Promise<IProcessFile> {
  const MAX_DIMENSION = 1000;
  const MINI_DIMENSION = 400;

  const processFile: IProcessFile = {
    dimensions: {
      width: 0,
      height: 0,
    },
    thumbnailFileName: '',
    thumbnailPath: '',
  };

  try {
    const input: Buffer | string = file.buffer
      ? Buffer.from(file.buffer)
      : file.path;

    if (!input) {
      throw new Error('Brak źródła obrazu (buffer/path)');
    }

    const metadata = await sharp(input).metadata();

    processFile.dimensions.width = metadata.width ?? 0;
    processFile.dimensions.height = metadata.height ?? 0;

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
    try {
      // save thumbnail
      await Promise.race([
        sharp(input)
          .resize({
            width: MINI_DIMENSION,
            height: MINI_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFile(miniPath),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Sharp timeout')), 10000),
        ),
      ]);
    } catch (error) {
      throw error;
    }

    processFile.thumbnailFileName = thumbnailFileName || '';
    processFile.thumbnailPath = miniPath || '';

    return processFile;
  } catch (error) {
    throw new ThumbnailError(error, '6512bd43-d9ca-4f98-8c7a-3b2e1f4d9a88');
  }
}
