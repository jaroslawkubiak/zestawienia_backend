import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { FileErrors } from './files-errors.entity';
import { IFilesErrors } from './types/IFilesErrors';

@Injectable()
export class FilesErrorsService {
  constructor(
    @InjectRepository(FileErrors)
    private readonly fileErrorRepository: Repository<FileErrors>,
  ) {}

  async logError(params: IFilesErrors): Promise<void> {
    const normalized = this.normalizeError(params.error);

    await this.fileErrorRepository.save({
      file_name: params.fileName,
      error_name: normalized.name,
      error_message: normalized.message,
      error_code: normalized.code ?? null,
      stack: normalized.stack ?? null,
      raw_error: normalized,
      source_file: normalized.sourceFile ?? null,
      source_line: normalized.sourceLine ?? null,
      source_file_name: params.source_file_name ?? '',
      source_file_function: params.source_file_function ?? '',
      source_uuid: params.source_uuid ?? '',
      user_id: params.user_id ?? '',
      set_id: params.set_id ?? '',
      createdAt: getFormatedDate(),
    });
  }

  private normalizeError(error: unknown): any {
    if (error instanceof Error) {
      const stackInfo = this.extractSourceFromStack(error.stack);

      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        sourceFile: stackInfo?.file ?? null,
        sourceLine: stackInfo?.line ?? null,
        ...(error as any),
      };
    }

    return {
      name: 'UnknownError',
      message: JSON.stringify(error),
      raw: error,
    };
  }

  private extractSourceFromStack(stack?: string) {
    if (!stack) return null;

    const lines = stack.split('\n');

    for (const line of lines) {
      const match = line.match(/\((.*):(\d+):(\d+)\)/);
      if (match && match[1].includes('src')) {
        return {
          file: match[1],
          line: parseInt(match[2], 10),
        };
      }
    }

    return null;
  }
}
