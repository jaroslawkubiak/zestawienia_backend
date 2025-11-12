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
import { ISetForSupplier } from './types/ISetForSupplier';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('new')
  create(@Body() newSet: NewSetDto, @Req() req: Request): Promise<ISavedSet> {
    return this.setsService.create(newSet, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateSet(
    @Param('id') id: string,
    @Body() updateSetDto: UpdateSetAndPositionDto,
    @Req() req: Request,
  ): Promise<any> {
    return this.setsService.update(+id, updateSetDto, req);
  }

  @Get(':setId')
  findSet(@Param('setId') setId: string): Observable<ISet> {
    return this.setsService.getSet(+setId);
  }

  @Get(':setId/:supplierId')
  findSetForSupplier(
    @Param('setId') setId: string,
  ): Observable<ISetForSupplier> {
    return this.setsService.getSetForSupplier(+setId);
  }

  @Get(':setId/:hash')
  validateSetAndHash(
    @Param('setId') setId: string,
    @Param('hash') hash: string,
  ): Observable<boolean> {
    return this.setsService.validateSetAndHash(+setId, hash);
  }

  @Get(':setId/:hash/:supplierHash')
  validateSetAndHashForSupplier(
    @Param('setId') setId: string,
    @Param('hash') hash: string,
    @Param('supplierHash') supplierHash: string,
  ): Observable<{ isValid: boolean; supplierId?: number }> {
    return this.setsService.validateSetAndHashForSupplier(
      +setId,
      hash,
      supplierHash,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.setsService.remove(+id);
  }
}
