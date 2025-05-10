// dto/download-files.dto.ts
import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DownloadFilesDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}
