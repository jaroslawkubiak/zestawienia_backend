import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { DirectoryDto } from './directory.dto';

export class DownloadZipDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectoryDto)
  directories: DirectoryDto[];
}
