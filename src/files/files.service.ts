import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IFileList } from './types/IFileList';

@Injectable()
export class FilesService {
  getFileList(setId: number): IFileList {
    const baseUploadPath = process.env.UPLOAD_PATH || './src/uploads/sets';
    const uploadPathFiles = path.resolve(
      baseUploadPath,
      'sets',
      String(setId),
      'files',
    );
    const uploadPathPdf = path.resolve(
      baseUploadPath,
      'sets',
      String(setId),
      'pdf',
    );

    if (!fs.existsSync(uploadPathFiles) && !fs.existsSync(uploadPathPdf)) {
      return null;
    }

    const filesList: string[] = [];
    const pdfList: string[] = [];

    if (fs.existsSync(uploadPathFiles)) {
      filesList.push(...fs.readdirSync(uploadPathFiles));
    }

    if (fs.existsSync(uploadPathPdf)) {
      pdfList.push(...fs.readdirSync(uploadPathPdf));
    }

    return { files: filesList, pdf: pdfList };
  }
}
