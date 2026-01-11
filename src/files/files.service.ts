import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as archiver from 'archiver';
import * as fss from 'fs';
import { promises as fs } from 'fs';
import { imageSize } from 'image-size';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Files } from './files.entity';
import { generateThumbnailPdf } from './generateThumbnailPdf';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';
import { IProcessFile } from './types/IProcessFile';

@Injectable()
export class FilesService {
  baseUploadPath = process.env.UPLOAD_PATH;

  constructor(
    @InjectRepository(Files)
    private readonly filesRepo: Repository<Files>,
  ) {}

  async findOne(id: number): Promise<IFileFullDetails> {
    return this.filesRepo.findOneBy({ id });
  }

  // find one file in set for download
  async findOneFileInSet(
    setId: number,
    fileId: number,
  ): Promise<IFileFullDetails> {
    return this.filesRepo
      .createQueryBuilder('file')
      .where('file.id = :fileId', { fileId })
      .andWhere('file.setId = :setId', { setId })
      .getOne();
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
    const filePath = path.join(
      this.baseUploadPath,
      fileToDelete.path,
      fileToDelete.fileName,
    );

    // security check to prevent path travelsal attacks
    if (!filePath.startsWith(this.baseUploadPath)) {
      throw new Error('Access denied');
    }

    // check if file exists before deleting
    try {
      await fs.access(filePath);
    } catch (err) {
      return {
        severity: 'warn',
        message: 'Plik nie istnieje',
        fileName: fileToDelete.fileName,
      };
    }

    // try to delete file
    try {
      await fs.unlink(filePath);

      await this.removeFromDB(id);

      return {
        severity: 'success',
        message: `Plik ${fileToDelete.fileName} został usunięty`,
        fileName: fileToDelete.fileName,
      };
    } catch (err) {
      return {
        severity: 'error',
        message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        fileName: fileToDelete.fileName,
      };
    }
  }

  async removeFromDB(id: number): Promise<void> {
    await this.filesRepo.delete(id);
  }

  async removeFilesFromSet(setId: number): Promise<void> {
    await this.filesRepo.delete({ setId: { id: setId } });
  }

  async downloadByIds(ids: number[]): Promise<archiver.Archiver> {
    const archive = archiver('zip', { zlib: { level: 9 } });

    for (const id of ids) {
      const file: IFileFullDetails = await this.findOne(id);
      if (!file) {
        return;
      }

      const filePath = path.join(this.baseUploadPath, file.path, file.fileName);
      const absolutePath = path.join(__dirname, '..', '..', filePath);
      const fileName = file.fileName;

      if (fss.existsSync(absolutePath)) {
        archive.file(absolutePath, { name: path.join(file.dir, fileName) });
      }
    }

    archive.finalize();

    return archive;
  }

  returnUploadMessage(filesCount: number, dir: string): string {
    const fileWord =
      filesCount === 1 ? 'plik' : filesCount < 5 ? 'pliki' : 'plików';
    return `Pomyślnie przesłano ${filesCount} ${fileWord} do katalogu "${dir}"`;
  }

  processImage(fileBuffer: Buffer<ArrayBufferLike>): IProcessFile {
    const fileDetails: IProcessFile = {
      dimensions: { width: 0, height: 0 },
      thumbnailPath: '',
      thumbnailFileName: '',
    };

    const size = imageSize(fileBuffer);
    if (size.width && size.height) {
      fileDetails.dimensions = {
        width: size.width,
        height: size.height,
      };

      return fileDetails;
    }
  }

  async processPdf(
    fileBuffer: Buffer<ArrayBufferLike>,
    file: Express.Multer.File,
  ): Promise<IProcessFile> {
    const fileDetails: IProcessFile = {
      dimensions: { width: 0, height: 0 },
      thumbnailPath: '',
      thumbnailFileName: '',
    };
    const outputDir = (file as any).absoluteUploadPath + '\\thumbnail';
    
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const size = pdfDoc.getPage(0).getSize();
    
    const PT_TO_MM = 25.4 / 72; // convert point to mm in PDF
    fileDetails.dimensions = {
      width: Math.floor(size.width * PT_TO_MM),
      height: Math.floor(size.height * PT_TO_MM),
    };

    // TODO - add this for iPhone users
    // generate thumbnail
    // const fileNameWithoutExt = path.parse(file['sanitizedOriginalName']).name;
    // console.log(`######## before generateThumbnailPdf #########`);

    // fileDetails.thumbnailFileName = await generateThumbnailPdf(
    //   file.path,
    //   fileNameWithoutExt,
    // );

    fileDetails.thumbnailPath = path
      .relative(process.cwd(), fileDetails.thumbnailFileName)
      .replace(/\\/g, '/');

    return fileDetails;
  }
}
