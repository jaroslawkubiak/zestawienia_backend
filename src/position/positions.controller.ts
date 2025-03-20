import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IPosition } from '../position/types/IPosition';
import { CreatePositionDto } from './dto/createPosition.dto';
import { PositionsService } from './positions.service';
import { CreateEmptyPositionDto } from './dto/createEmptyPosition.dto';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get('/:setId')
  getPositions(@Param('setId') setId: string): Observable<IPosition[]> {
    return this.positionsService.getPositions(+setId);
  }

  @Post('')
  addPosition(@Body() newPosition: CreateEmptyPositionDto): Promise<IPosition> {
    return this.positionsService.addPosition(newPosition);
  }
}
