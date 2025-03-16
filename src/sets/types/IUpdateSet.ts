import { IPosition } from '../../position/types/IPosition';
import { ISet } from './ISet';

export interface IUpdateSet {
  set: ISet;
  positions: IPosition[];
}
