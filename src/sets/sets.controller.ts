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
import { UpdateSetDto } from './dto/updateSet.dto';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getSets')
  findAllSets() {
    return this.setsService.findAllSets();
  }

  @UseGuards(JwtAuthGuard)
  @Post('addNew')
  createSet(
    @Body() newSet: NewSetDto,
    @Req() req: Request,
  ): Promise<ISavedSet> {
    return this.setsService.createSet(newSet, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/saveSet')
  updateSet(
    @Param('id') id: string,
    @Body() updateSetDto: UpdateSetAndPositionDto,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.setsService.updateSet(+id, updateSetDto, req);
  }

  @Get('/:setId/getSet')
  getSet(@Param('setId') setId: string): Observable<ISet> {
    return this.setsService.getSet(+setId, 'client');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeSet(@Param('id') id: number) {
    return this.setsService.removeSet(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/updateBookmark')
  updateLastUsedBookmark(
    @Param('id') setId: string,
    @Body() updateSetDto: UpdateSetDto,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.setsService.updateLastUsedBookmark(+setId, updateSetDto, req);
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

  // external link for clients - save last used bookmark
  @Patch(':setHash/:newBookmark/lastActiveClientBookmark')
  updateLastActiveClientBookmark(
    @Param('setHash') setHash: string,
    @Param('newBookmark') newBookmark: string,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.setsService.updateLastActiveClientBookmark(
      setHash,
      +newBookmark,
      req,
    );
  }
}
