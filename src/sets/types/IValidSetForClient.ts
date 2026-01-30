import { IPositionForSupplier } from '../../position/types/IPositionForSupplier';
import { ISet } from './ISet';

export interface IValidSetForClient {
  valid: boolean;
  set: ISet;
  positions: IPositionForSupplier[];
}
