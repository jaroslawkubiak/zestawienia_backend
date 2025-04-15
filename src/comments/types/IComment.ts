import { Set } from '../../sets/sets.entity';
import { Position } from '../../position/positions.entity';

export interface IComment {
  id: number;
  comment: string;
  authorType: 'client' | 'user';
  authorId: number;
  readByReceiver: boolean;
  createdAt: string;
  createdAtTimestamp: number;
  positionId: Position;
  setId: Set;
}
