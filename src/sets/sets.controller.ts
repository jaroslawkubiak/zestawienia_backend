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
import { IValidSetForClient } from './types/IValidSetForClient';
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
  @Get('open-for-supplier/:setHash/:supplierHash')
  validateSetAndHashForSupplier(
    @Param('setHash') setHash: string,
    @Param('supplierHash') supplierHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForSupplier | null> {
    return this.setsService.validateSetAndHashForSupplier(
      setHash,
      supplierHash,
      req,
    );
  }

  // external link for clients
  @Get('open-for-client/:setHash/:clientHash')
  validateSetAndHashForClient(
    @Param('setHash') setHash: string,
    @Param('clientHash') clientHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForClient | null> {
    return this.setsService.validateSetAndHashForClient(
      setHash,
      clientHash,
      req,
    );
  }
}
