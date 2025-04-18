import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { IFileList } from './types/IFileList';
import { IFileToRemove } from './types/IFileToRemove';
import { promises as fs } from 'fs';
import * as fss from 'fs';

@Injectable()
export class FilesService {
  // get list of attachment to set id
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

    const uploadPathInspirations = path.resolve(
      baseUploadPath,
      'sets',
      String(setId),
      'inspirations',
    );

    if (
      !fss.existsSync(uploadPathFiles) &&
      !fss.existsSync(uploadPathPdf) &&
      !fss.existsSync(uploadPathInspirations)
    ) {
      return null;
    }

    const filesList: string[] = [];
    const pdfList: string[] = [];
    const inspirationsList: string[] = [];

    if (fss.existsSync(uploadPathFiles)) {
      filesList.push(...fss.readdirSync(uploadPathFiles));
    }

    if (fss.existsSync(uploadPathPdf)) {
      pdfList.push(...fss.readdirSync(uploadPathPdf));
    }

    if (fss.existsSync(uploadPathInspirations)) {
      inspirationsList.push(...fss.readdirSync(uploadPathInspirations));
    }

    return { files: filesList, pdf: pdfList, inspirations: inspirationsList };
  }

  // delete file from set
  async deleteFile(file: IFileToRemove) {
    const baseUploadPath = process.env.UPLOAD_PATH;
    const filePath = path.join(
      baseUploadPath,
      'sets',
      file.setId,
      file.path,
      file.fileName,
    );

    // security check to prevent path travelsal attacks
    if (!filePath.startsWith(baseUploadPath)) {
      throw new Error('Access denied');
    }

    // check if file exists before deleting
    try {
      await fs.access(filePath);
    } catch (err) {
      console.warn(`⚠️ File does not exist: ${filePath}`);
      return {
        severity: 'warn',
        message: 'Plik nie istnieje',
        fileName: file.fileName,
      };
    }

    // try to delete file
    try {
      await fs.unlink(filePath);
      console.log(`✅ File deleted: ${filePath}`);
      return {
        severity: 'success',
        message: `Plik ${file.fileName} został usunięty`,
        fileName: file.fileName,
      };
    } catch (err) {
      console.error(`❌ Error deleting file: ${filePath}`, err);
      return {
        severity: 'error',
        message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        fileName: file.fileName,
      };
    }
  }
}
