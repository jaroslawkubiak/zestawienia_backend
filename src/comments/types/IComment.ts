import { IPosition } from '../../position/types/IPosition';
import { ISet } from '../../sets/types/ISet';

export interface IComment {
  id: number;
  comment: string;
  authorType: 'client' | 'user';
  authorId: number;
  readByReceiver: boolean;
  createdAt: string;
  createdAtTimestamp: number;
  positionId: IPosition;
  setId: ISet;
}
