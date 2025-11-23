import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IPosition } from '../position/types/IPosition';
import { CreateClonePositionDto } from './dto/createClonePosition.dto';
import { CreateEmptyPositionDto } from './dto/createEmptyPosition.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get('/:setId')
  getPositions(@Param('setId') setId: string): Observable<IPosition[]> {
    return this.positionsService.getPositions(+setId);
  }

  @Get('/:setId/:supplierId')
  getPositionsForSupplier(
    @Param('setId') setId: string,
    @Param('supplierId') supplierId: string,
  ): Observable<IPosition[]> {
    return this.positionsService.getPositionsForSuppliers(+setId, +supplierId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/new')
  addPosition(@Body() newPosition: CreateEmptyPositionDto): Promise<IPosition> {
    return this.positionsService.addPosition(newPosition);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/clone')
  clonePosition(
    @Body() clonePosition: CreateClonePositionDto,
  ): Promise<IPosition> {
    return this.positionsService.clonePosition(clonePosition);
  }
}
