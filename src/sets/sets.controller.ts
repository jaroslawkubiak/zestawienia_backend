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
import { UpdateSetDto } from './dto/updateSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { SetsService } from './sets.service';
import { ISavedSet } from './types/ISavedSet';
import { ISet } from './types/ISet';

@UseGuards(JwtAuthGuard)
@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get('getSets')
  findAllSets() {
    return this.setsService.findAllSets();
  }

  @Post('addNew')
  createSet(
    @Body() newSet: NewSetDto,
    @Req() req: Request,
  ): Promise<ISavedSet> {
    return this.setsService.createSet(newSet, req);
  }

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

  @Delete(':id')
  removeSet(@Param('id') id: number) {
    return this.setsService.removeSet(+id);
  }

  @Patch(':id/updateLastActiveUserBookmark')
  updateLastActiveUserBookmark(
    @Param('id') setId: string,
    @Body() updateSetDto: UpdateSetDto,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.setsService.updateLastActiveUserBookmark(
      +setId,
      updateSetDto,
      req,
    );
  }

  @Patch(':id/updateSetStatus')
  updateSetStatus(
    @Param('id') setId: string,
    @Body() updateSetDto: UpdateSetDto,
    @Req() req: Request,
  ): Promise<ISet> {
    return this.setsService.updateSetStatus(+setId, updateSetDto, req);
  }
}
