import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { SetsService } from './sets.service';
import { ISavedSet } from './types/ISavedSet';
import { ISet } from './types/ISet';
import { IValidSetForSupplier } from './types/IValidSetForSupplier';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getSets')
  findAll() {
    return this.setsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('addNew')
  create(@Body() newSet: NewSetDto, @Req() req: Request): Promise<ISavedSet> {
    return this.setsService.create(newSet, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/saveSet')
  updateSet(
    @Param('id') id: string,
    @Body() updateSetDto: UpdateSetAndPositionDto,
    @Req() req: Request,
  ): Promise<any> {
    return this.setsService.update(+id, updateSetDto, req);
  }

  //TODO potrzebny jest bez guarda? nie, to external client na niego dzwoni
  @Get('/:setId/getSet')
  findSet(@Param('setId') setId: string): Observable<ISet> {
    return this.setsService.getSet(+setId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.setsService.remove(+id);
  }

  // external link for suppliers
  @Get('/:hash/:supplierHash')
  validateSetAndHashForSupplier(
    @Param('hash') hash: string,
    @Param('supplierHash') supplierHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForSupplier> {
    return this.setsService.validateSetAndHashForSupplier(
      hash,
      supplierHash,
      req,
    );
  }
}
