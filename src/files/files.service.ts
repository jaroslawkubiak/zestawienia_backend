import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as archiver from 'archiver';
import * as fss from 'fs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';
import { Repository } from 'typeorm';
import { FilesErrorsService } from '../files-erros/files-erros.service';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Files } from './files.entity';
import { generateThumbnailPdf } from './generateThumbnailPdf';
import { EFileDirectory } from './types/file-directory-list.enum';
import { IDataForLogErrors } from './types/IDataForLogErrors';
import { IDeletedFileResponse } from './types/IDeletedFileResponse';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';
import { IProcessFile } from './types/IProcessFile';
import { DownloadZipDto } from './dto/downloadZip.dto';

@Injectable()
export class FilesService {
  baseUploadPath = process.env.UPLOAD_PATH;

  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    private readonly filesErrorsService: FilesErrorsService,
  ) {}

  async findOneFile(id: number): Promise<IFileFullDetails> {
    const oneFile = await this.filesRepository.findOne({
      where: { id },
      relations: ['setId'],
    });

    const returnedFile: IFileFullDetails = {
      ...oneFile,
      createdAtTimestamp: +oneFile.createdAtTimestamp!,
      setId: oneFile.setId?.id ?? null,
    };

    return returnedFile;
  }

  // find one file in set for download
  async findOneFileInSet(setId: number, fileId: number): Promise<Files> {
    return this.filesRepository
      .createQueryBuilder('file')
      .where('file.id = :fileId', { fileId })
      .andWhere('file.setId = :setId', { setId })
      .getOne();
  }

  // save file info in db
  async createFileEntry(file: IFileDetails): Promise<any> {
    const newFile = this.filesRepository.create({
      ...file,
      setId: { id: Number(file.setId) },
      createdAt: getFormatedDate(),
      createdAtTimestamp: Date.now(),
    });

    const response = await this.filesRepository.save(newFile);

    const mappedFile: IFileFullDetails = {
      id: response.id,
      fileName: response.fileName,
      type: response.type,
      path: response.path,
      dir: response.dir as EFileDirectory,
      originalName: response.originalName,
      size: response.size,
      width: response.width,
      height: response.height,
      setId: response.setId.id,
      createdAt: response.createdAt,
      createdAtTimestamp: response.createdAtTimestamp,
      thumbnail: response.thumbnail,
    };

    return mappedFile;
  }

  // delete file from set
  async deleteFile(
    id: number,
    forLogError: IDataForLogErrors,
  ): Promise<IDeletedFileResponse> {
    const fileToDelete = await this.findOneFile(id);
    const filePath = path.join(
      this.baseUploadPath,
      fileToDelete.path,
      fileToDelete.fileName,
    );

    const fileThumbnailPath = path.join(
      this.baseUploadPath,
      fileToDelete.path,
      fileToDelete.thumbnail,
    );
    forLogError.set_id = fileToDelete.setId.toString();

    // security check to prevent path travelsal attacks
    if (!filePath.startsWith(this.baseUploadPath)) {
      throw new Error('Access denied');
    }

    // check if main file exists
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
      // delete main file
      await fs.unlink(filePath);

      // delete thumbnail only if it exists
      try {
        await fs.access(fileThumbnailPath);
        await fs.unlink(fileThumbnailPath);
      } catch {}

      await this.removeFromDB(id);

      return {
        severity: 'success',
        message: `Plik ${fileToDelete.fileName} został usunięty`,
        fileName: fileToDelete.fileName,
      };
    } catch (error) {
      await this.filesErrorsService.logError({
        fileName: fileToDelete.originalName,
        error,
        source_file_name: 'files.service.ts',
        source_file_function: 'deleteFile',
        source_uuid: 'c9f0f895-6f7a-4a1d-8b3a-1f0e9c7d2a44',
        ...forLogError,
      });

      return {
        severity: 'error',
        message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        fileName: fileToDelete.fileName,
      };
    }
  }

  async removeFromDB(id: number): Promise<void> {
    await this.filesRepository.delete(id);
  }

  async removeFilesFromSet(setId: number): Promise<void> {
    await this.filesRepository.delete({ setId: { id: setId } });
  }

  async downloadByIds(body: DownloadZipDto): Promise<archiver.Archiver> {
    const { ids, directories } = body;

    const dirMap: Record<string, string> = {};
    directories.forEach((d) => {
      dirMap[d.dir] = d.dirLabel;
    });

    const archive = archiver('zip', { zlib: { level: 9 } });

    for (const id of ids) {
      const file: IFileFullDetails = await this.findOneFile(id);
      if (!file) continue;

      const filePath = path.join(this.baseUploadPath, file.path, file.fileName);
      const absolutePath = path.join(__dirname, '..', '..', filePath);
      const fileName = file.fileName;

      if (fss.existsSync(absolutePath)) {
        const zipDir = dirMap[file.dir] || file.dir;
        archive.file(absolutePath, { name: path.join(zipDir, fileName) });
      }
    }

    archive.finalize();

    return archive;
  }

  async processPdf(
    fileBuffer: Buffer<ArrayBufferLike>,
    file: Express.Multer.File,
    forLogError: IDataForLogErrors,
  ): Promise<IProcessFile> {
    const fileDetails: IProcessFile = {
      dimensions: { width: 0, height: 0 },
      thumbnailPath: '',
      thumbnailFileName: '',
    };

    // get PDF dimension
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const size = pdfDoc.getPage(0).getSize();

    const PT_TO_MM = 25.4 / 72; // convert point to mm in PDF
    fileDetails.dimensions = {
      width: Math.floor(size.width * PT_TO_MM),
      height: Math.floor(size.height * PT_TO_MM),
    };

    // try to generate thumbnail
    const fileNameWithoutExt = path.parse(file['sanitizedOriginalName']).name;

    try {
      const thumbFileName = await generateThumbnailPdf(
        file.path,
        fileNameWithoutExt,
      );
      fileDetails.thumbnailFileName = thumbFileName;
      fileDetails.thumbnailPath = path
        .relative(process.cwd(), thumbFileName)
        .replace(/\\/g, '/');
    } catch (error) {
      await this.filesErrorsService.logError({
        fileName: file.originalname,
        error,
        source_file_name: 'files.service.ts',
        source_file_function: 'processPdf',
        source_uuid: '45c48cce-2e2d-4b6f-9e0a-7d3f1b2c8a55',
        ...forLogError,
      });

      fileDetails.thumbnailFileName = '';
      fileDetails.thumbnailPath = '';
    }

    return fileDetails;
  }
}
