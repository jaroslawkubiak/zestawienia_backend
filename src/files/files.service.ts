import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fss from 'fs';
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

  // get list of attachment to set id
  async getFileList(setId: number): Promise<IFileFullDetails[]> {
    // const baseUploadPath = process.env.UPLOAD_PATH || './src/uploads/sets';
    // const uploadPathFiles = path.resolve(
    //   baseUploadPath,
    //   'sets',
    //   String(setId),
    //   'files',
    // );
    // const uploadPathPdf = path.resolve(
    //   baseUploadPath,
    //   'sets',
    //   String(setId),
    //   'pdf',
    // );

    // const uploadPathInspirations = path.resolve(
    //   baseUploadPath,
    //   'sets',
    //   String(setId),
    //   'inspirations',
    // );

    // if (
    //   !fss.existsSync(uploadPathFiles) &&
    //   !fss.existsSync(uploadPathPdf) &&
    //   !fss.existsSync(uploadPathInspirations)
    // ) {
    //   return null;
    // }

    // const filesList: string[] = [];
    // const pdfList: string[] = [];
    // const inspirationsList: string[] = [];

    // if (fss.existsSync(uploadPathFiles)) {
    //   filesList.push(...fss.readdirSync(uploadPathFiles));
    // }

    // if (fss.existsSync(uploadPathPdf)) {
    //   pdfList.push(...fss.readdirSync(uploadPathPdf));
    // }

    // if (fss.existsSync(uploadPathInspirations)) {
    //   inspirationsList.push(...fss.readdirSync(uploadPathInspirations));
    // }
    const files = await this.filesRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.setId', 'set')
      .where('set.id = :setId', { setId: 1 })
      .getMany();

    return files;
  }

  // delete file from set
  async deleteFile(id: number) {
    const fileToDelete = await this.findOne(id);
    console.log(`##### file to usun #####`);
    console.log(fileToDelete);
    // const baseUploadPath = process.env.UPLOAD_PATH;
    // const filePath = path.join(
    //   baseUploadPath,
    //   'sets',
    //   file.setId,
    //   file.path,
    //   file.fileName,
    // );
    // // security check to prevent path travelsal attacks
    // if (!filePath.startsWith(baseUploadPath)) {
    //   throw new Error('Access denied');
    // }
    // // check if file exists before deleting
    // try {
    //   await fs.access(filePath);
    // } catch (err) {
    //   console.warn(`⚠️ File does not exist: ${filePath}`);
    //   return {
    //     severity: 'warn',
    //     message: 'Plik nie istnieje',
    //     fileName: file.fileName,
    //   };
    // }
    // // try to delete file
    // try {
    //   await fs.unlink(filePath);
    //   console.log(`✅ File deleted: ${filePath}`);
    //   return {
    //     severity: 'success',
    //     message: `Plik ${file.fileName} został usunięty`,
    //     fileName: file.fileName,
    //   };
    // } catch (err) {
    //   console.error(`❌ Error deleting file: ${filePath}`, err);
    //   return {
    //     severity: 'error',
    //     message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
    //     fileName: file.fileName,
    //   };
    // }
  }

  // async remove(id: number): Promise<void> {
  //   await this.filesRepo.delete(id);
  // }
}
