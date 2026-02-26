import { IsEnum, IsString } from 'class-validator';
import { EFileDirectory } from '../types/file-directory-list.enum';

export class DirectoryDto {
  @IsEnum(EFileDirectory)
  dir: EFileDirectory;

  @IsString()
  dirLabel: string;
}
