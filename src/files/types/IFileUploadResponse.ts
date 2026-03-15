import { IAvatar } from '../../avatar/types/IAvatar';
import { IFileFullDetails } from './IFileFullDetails';

export interface IFileUploadResponse {
  dir: string;
  filesCount: number;
  files: IFileFullDetails[] | IAvatar[];
  fileNames: string[];
}
