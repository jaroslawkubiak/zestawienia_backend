import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Files } from './files.entity';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepo: Repository<Files>,
  ) {}

  findAll(): Promise<IFileFullDetails[]> {
    return this.filesRepo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<IFileFullDetails> {
    return this.filesRepo.findOneBy({ id });
  }

  // save file info in db
  async create(file: IFileDetails): Promise<IFileFullDetails> {
    const newFile = {
      ...file,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
    };

    const savedFile = this.filesRepo.create(newFile);
    return this.filesRepo.save(savedFile);
  }

  // delete file from set
  async deleteFile(id: number) {
    const fileToDelete = await this.findOne(id);
    const baseUploadPath = process.env.UPLOAD_PATH;
    const filePath = path.join(
      baseUploadPath,
      fileToDelete.path,
      fileToDelete.fileName,
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
        fileName: fileToDelete.fileName,
      };
    }

    // try to delete file
    try {
      await fs.unlink(filePath);
      console.log(`✅ File deleted: ${filePath}`);
      await this.remove(id);

      return {
        severity: 'success',
        message: `Plik ${fileToDelete.fileName} został usunięty`,
        fileName: fileToDelete.fileName,
      };
    } catch (err) {
      console.error(`❌ Error deleting file: ${filePath}`, err);
      return {
        severity: 'error',
        message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        fileName: fileToDelete.fileName,
      };
    }
  }

  async remove(id: number): Promise<void> {
    await this.filesRepo.delete(id);
  }

  async removeFilesFromSet(setId: number): Promise<void> {
    await this.filesRepo
      .createQueryBuilder('file')
      .delete()
      .where('file.setId = :setId', { setId })
      .execute();
  }
}
