import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  getFileList(setId: number): string[] {
    const baseUploadPath = process.env.UPLOAD_PATH || './src/uploads/sets';
    const uploadPath = path.resolve(
      baseUploadPath,
      'sets',
      String(setId),
      'files',
    );

    if (!fs.existsSync(uploadPath)) {
      return [];
    }

    return fs.readdirSync(uploadPath);
  }
}
