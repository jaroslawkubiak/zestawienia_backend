import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IPosition } from '../position/types/IPosition';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get('/:setId')
  getPositions(@Param('setId') setId: string): Observable<IPosition[]> {
    return this.positionsService.getPositions(+setId);
  }
}
